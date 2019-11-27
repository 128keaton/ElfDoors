import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {IntelliDoorsService} from '../../services/intelli-access/services';
import {LastUpdatedService} from '../../services/last-updated.service';
import {PageTitleService} from '../../services/page-title.service';
import {forkJoin, Observable, ReplaySubject} from 'rxjs';
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
  doorsOnMap: IntelliDoorLocation[] = [];
  currentMap: Observable<IntelliMap>;
  doors: Observable<IntelliDoor[]>;

  doorsAvailable: ReplaySubject<IntelliDoor[]> = new ReplaySubject<IntelliDoor[]>();
  doorMarkers: DoorMarker[] = [];

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


    this.doors = this.doorsService.getDoorsStatus().pipe(
      map(doorsResponse => doorsResponse.doors),
      tap(() => this.lastUpdatedService.now())
    );

    this.currentMap = this.mapService.getMap();

    forkJoin([this.doors, this.currentMap]).subscribe(results => {
      const intelliDoors: IntelliDoor[] = results[0];
      const intelliMap: IntelliMap = results[1];
      const doorLocationNames = intelliMap.doors.filter(doorLocation => doorLocation.x && doorLocation.y)
                                                .map(doorLocation => doorLocation.name);

      const doorsAvailable = intelliDoors.filter(door => {
        return !doorLocationNames.includes(door.name);
      });


      console.log('Doors available to drag:', doorsAvailable);


      this.doorMarkers = intelliMap.doors.filter(doorLocation => doorLocation.x && doorLocation.y)
        .map(doorLocation => {
          const door = intelliDoors.find(intelliDoor => doorLocation.name === intelliDoor.name);
          const doorMarker =  new DoorMarker(door, latLng(doorLocation.y, doorLocation.x), {
            draggable: true
          });

          doorMarker.on(this.onDragged());

          return doorMarker;
        });

      console.log('Door markers:', this.doorMarkers);
      this.doorsAvailable.next(doorsAvailable);
    });

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
  }

  private updateDoorMarkers() {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }
}
