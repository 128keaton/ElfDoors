import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {IntelliDoorsService} from '../../services/intelli-access/services';
import {LastUpdatedService} from '../../services/last-updated.service';
import {PageTitleService} from '../../services/page-title.service';
import {Observable} from 'rxjs';
import {IntelliDoor} from '../../services/intelli-access/models/doors/intelli-door.model';
import {map, tap} from 'rxjs/operators';
import {IntelliMap} from '../../services/intelli-access/models/map/intelli-map.model';
import {IntelliMapService} from '../../services/intelli-access/services/intelli-map.service';
import {IntelliDoorLocation} from '../../services/intelli-access/models/map/intelli-door-location.model';
import {CRS, imageOverlay, latLng, LatLngBoundsExpression, Layer, LeafletEventHandlerFnMap, Map, Point} from 'leaflet';
import {DoorMarker} from '../../intelli-door-marker';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  doorsAvailable: IntelliDoorLocation[] = [];
  doorsOnMap: IntelliDoorLocation[] = [];
  doors: Observable<IntelliDoor[]>;
  currentMap: IntelliMap;

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

  constructor(private doorsService: IntelliDoorsService, private mapService: IntelliMapService,
              private lastUpdatedService: LastUpdatedService, pageTitleService: PageTitleService) {
    pageTitleService.updatePageTitle('Map');
  }

  onMapReady(leafletMap: Map): void {
    leafletMap.fitBounds(this.mapImageBounds);
  }

  onDragged(): LeafletEventHandlerFnMap {
    return {
      dragend: (event => {
        const newPoint: Point = event.sourceTarget._newPos;
        console.log('dragged:', newPoint.x, newPoint.y, event);
      })
    };
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

      if (this.currentMap.doors) {
        this.doorsAvailable = this.currentMap.doors.filter(doorLocation => !doorLocation.x && !doorLocation.y);
        this.doorsOnMap = this.currentMap.doors.filter(doorLocation => doorLocation.x && doorLocation.y);
      } else {
        this.doorsAvailable = [];
        this.doorsOnMap = [];
      }

      this.updateDoorMarkers();
    });
  }

  private updateDoorMarkers() {
    this.doorMarkers = this.doorsOnMap
      .filter(doorLocation => doorLocation.x && doorLocation.y)
      .map(doorLocation => {
        const coords = latLng(doorLocation.x, doorLocation.y);
        const door = this.doors.pipe(
          map(doors => doors.find(aDoor => aDoor.name === doorLocation.name))
        );

        const doorMarker = new DoorMarker(door, coords, {
          draggable: true
        });

        doorMarker.on(this.onDragged());
        return doorMarker;
      });
  }

  ngOnInit() {
    this.doors = this.doorsService.getDoorsStatus().pipe(
      map(doorsResponse => doorsResponse.doors),
      tap(() => this.lastUpdatedService.now())
    );
  }

  ngOnDestroy(): void {
  }
}
