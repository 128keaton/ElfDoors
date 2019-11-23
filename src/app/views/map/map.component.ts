import {AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {IntelliDoorsService} from '../../services/intelli-access/services';
import {LastUpdatedService} from '../../services/last-updated.service';
import {PageTitleService} from '../../services/page-title.service';
import {Observable, ReplaySubject} from 'rxjs';
import {IntelliDoor} from '../../services/intelli-access/models/doors/intelli-door.model';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {delay, map, repeatWhen, tap} from 'rxjs/operators';
import {IntelliDoorStatus} from '../../services/intelli-access/models/status/intelli-door-status.enum';
import {CdkDrag, CdkDragEnd, CdkDragStart} from '@angular/cdk/drag-drop';
import {IntelliMap} from '../../services/intelli-access/models/map/intelli-map.model';
import {IntelliMapService} from '../../services/intelli-access/services/intelli-map.service';
import {IntelliDoorLocation} from '../../services/intelli-access/models/map/intelli-door-location.model';
import {
  CRS,
  DragEndEventHandlerFn,
  icon,
  ImageOverlay,
  imageOverlay,
  latLng,
  LatLngBoundsExpression,
  LatLngExpression,
  Layer, LeafletEventHandlerFn, LeafletEventHandlerFnMap,
  Map,
  Marker,
  marker, Point
} from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  doors: Observable<IntelliDoor[]>;
  hasAnimated = false;
  currentMap: IntelliMap;
  doorLocations: IntelliDoorLocation[] = [];
  doorLocationsChanged = new ReplaySubject<IntelliDoorLocation[]>();

  doorMarkers: Layer[] = [];
  mapImageBounds: LatLngBoundsExpression = [[0, 0], [1500, 1000]];
  mapOverlay = imageOverlay('/assets/map-test.jpg', this.mapImageBounds);
  options = {
    attributionControl: false,
    crs: CRS.Simple,
    layers: [
      this.mapOverlay
    ],
    minZoom: -5,
  };

  constructor(private doorsService: IntelliDoorsService,
              private mapService: IntelliMapService,
              private lastUpdatedService: LastUpdatedService,
              pageTitleService: PageTitleService) {
    pageTitleService.updatePageTitle('Map');
  }

  onMapReady(leafletMap: Map): void {
    leafletMap.fitBounds(this.mapImageBounds);
  }

  setDoorLocations(): void {
    if (this.doorLocations.length > 0) {
      this.doorLocationsChanged.next(this.doorLocations);
      this.doorMarkers = this.doorLocations.map(doorLocation => {
        let doorMarkerPosition: LatLngExpression = [doorLocation.x, doorLocation.y];

        if (!doorLocation.x && !doorLocation.y) {
          doorMarkerPosition = this.randomPoints(this.mapOverlay);
        }

        const doorMarker = marker(doorMarkerPosition, {
          draggable: true,
          icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'assets/marker-icon.png',
            shadowUrl: 'assets/marker-shadow.png'
          })
        });

        doorMarker.on(this.onDragged());
        return doorMarker;
      });
    }
  }

  onDragged(): LeafletEventHandlerFnMap {
   return {
     dragend: (event => {
      const newPoint: Point = event.sourceTarget._newPos;
      console.log('dragged:', newPoint.x, newPoint.y, event);
    })
   };
  }

  doorPosition(forDoor: IntelliDoor): Observable<{ x: number, y: number }> {
    return this.doorLocationsChanged.pipe(
      map(doorLocations => {
        const foundDoorLocation = doorLocations.find(doorLocation => doorLocation.name === forDoor.name);
        return {x: foundDoorLocation.x, y: foundDoorLocation.y};
      })
    );
  }

  dragEnded($event: CdkDragEnd) {
    const doorsDockWrapper = document.body.getElementsByClassName('doors-available').item(0) as HTMLElement;
    const draggedDoor: IntelliDoor = $event.source.data;
    const position = $event.source.getFreeDragPosition();

    let doorLocation: IntelliDoorLocation = this.doorLocations.find(existingDoorLocation => existingDoorLocation.name === draggedDoor.name);

    if (!doorLocation) {
      doorLocation = new IntelliDoorLocation();
      doorLocation.name = draggedDoor.name;
      doorLocation.x = position.x;
      doorLocation.y = position.y;
      this.doorLocations.push(doorLocation);
    } else {
      doorLocation.name = draggedDoor.name;
      doorLocation.x = position.x;
      doorLocation.y = position.y;
    }


    if (this.currentMap) {
      this.currentMap.doors = this.doorLocations;
      //   this.doorLocationsChanged.next(this.doorLocations);
      this.mapService.saveMap(this.currentMap).subscribe(res => console.log(res));
    }
  }


  ngAfterViewInit(): void {
    this.mapService.getMap().subscribe(intelliMap => {
      if (intelliMap === null || !intelliMap.doors) {
        this.currentMap = new IntelliMap();
      } else {
        const parsedIntelliMap = new IntelliMap();
        parsedIntelliMap.deserialize(intelliMap);
        this.currentMap = parsedIntelliMap;
      }

      console.log('Received map:', this.currentMap);

      if (this.currentMap.doors) {
        this.doorLocations = this.currentMap.doors;
      } else {
        this.doorLocations = [];
      }

      this.setDoorLocations();
    });
  }

  dragStarted($event: CdkDragStart) {
    // const source: any = $event.source;
    //  source._passiveTransform = { x: 0, y: 0 };
    console.log('drag started', $event);
  }

  ngOnInit() {
    if (false) {
      this.doors = this.doorsService.getDoorsStatus().pipe(
        untilDestroyed(this),
        repeatWhen(complete => complete.pipe(delay(2000))),
        map(doorsResponse => doorsResponse.doors),
        tap(() => {
          this.hasAnimated = true;
          this.lastUpdatedService.now();
        })
      );
    } else {
      this.doors = this.doorsService.getDoorsStatus().pipe(
        map(doorsResponse => doorsResponse.doors),
        tap(() => this.lastUpdatedService.now())
      );
    }
  }

  ngOnDestroy(): void {
  }

  randomPoints(inLayer: ImageOverlay): LatLngExpression {
    const bounds = inLayer.getBounds();
    const xMin  = bounds.getEast();
    const xMax  = bounds.getWest();
    const yMin  = bounds.getSouth();
    const yMax  = bounds.getNorth();

    const lat = yMin + (Math.random() * (yMax - yMin));
    const lng = xMin + (Math.random() * (xMax - xMin));

    const inside = bounds.contains([lat, lng]);

    if (inside) {
      return [lat, lng];
    } else {
      return this.randomPoints(inLayer);
    }
  }
}
