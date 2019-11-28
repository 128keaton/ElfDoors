import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {IntelliDoorsService} from '../../services/intelli-access/services';
import {LastUpdatedService} from '../../services/last-updated.service';
import {PageTitleService} from '../../services/page-title.service';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {IntelliDoor} from '../../services/intelli-access/models/doors/intelli-door.model';
import {delay, map, repeatWhen, tap} from 'rxjs/operators';
import {IntelliMap} from '../../services/intelli-access/models/map/intelli-map.model';
import {IntelliMapService} from '../../services/intelli-access/services/intelli-map.service';
import {IntelliDoorLocation} from '../../services/intelli-access/models/map/intelli-door-location.model';
import {CRS, imageOverlay, latLng, LatLngBoundsExpression, LeafletEventHandlerFnMap, Map} from 'leaflet';
import {DoorMarker} from '../../markers/intelli-door-marker';
import {CdkDrag} from '@angular/cdk/drag-drop';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  doorLocations: IntelliDoorLocation[] = [];
  currentMap: Observable<IntelliMap>;
  doors: Observable<IntelliDoor[]>;

  doorsAvailable: BehaviorSubject<IntelliDoor[]> = new BehaviorSubject<IntelliDoor[]>([]);
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

  private isEditing = false;
  private intelliMapSubject = new BehaviorSubject<IntelliMap>(null);
  private intelliDoorsSubject = new BehaviorSubject<IntelliDoor[]>(null);

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

      this.intelliDoorsSubject.next(intelliDoors);
      this.intelliMapSubject.next(intelliMap);

      const doorLocationNames = intelliMap.doors.filter(doorLocation => doorLocation.x && doorLocation.y)
        .map(doorLocation => doorLocation.name);

      const doorsAvailable = intelliDoors.filter(door => {
        return !doorLocationNames.includes(door.name);
      });


      console.log('Doors available to drag:', doorsAvailable);


      this.doorMarkers = intelliMap.doors.filter(doorLocation => doorLocation.x && doorLocation.y)
        .map(doorLocation => {
          const door = intelliDoors.find(intelliDoor => doorLocation.name === intelliDoor.name);
          const doorMarker = this.createDoorMarker(doorLocation.x, doorLocation.y, door);
          this.doorLocations.push(doorLocation);

          return doorMarker;
        });

      console.log('Door markers:', this.doorMarkers);
      this.doorsAvailable.next(doorsAvailable);
    });

  }

  dropped(event: {source: CdkDrag}) {
    const doorName = event.source.element.nativeElement.innerText;
    const door = this.intelliDoorsSubject.value.find(aDoor => aDoor.name === doorName);

    console.log(event.source.element.nativeElement.clientLeft);
    event.source.dropped.subscribe(dropped => {
      const doorLocation = new IntelliDoorLocation();
      const x = 500;
      const y = 750;
      const doorMarker = this.createDoorMarker(x, y, door);

      doorLocation.x = x;
      doorLocation.y = y;
      doorLocation.name = doorName;

      this.doorMarkers.push(doorMarker);
      this.doorLocations.push(doorLocation);
      this.updateMap();
    });

    const currentDoorsAvailable = this.doorsAvailable.value.filter(doorAvailable => doorAvailable.name !== doorName);
    this.doorsAvailable.next(currentDoorsAvailable);
  }

  // Smooth zoom in/out because updating kills the scaling
  onMapReady(leafletMap: Map): void {
    leafletMap.fitBounds(this.mapImageBounds);
    leafletMap.on({
      zoomstart: () => {
        this.isEditing = true;
      },
      zoomend: () => {
        this.isEditing = false;
      }
    });
  }

  onDragged(marker: DoorMarker): LeafletEventHandlerFnMap {
    return {
      dragstart: (() => {
        this.isEditing = true;
      }),
      dragend: (() => {
        let doorLocation = this.doorLocations.find(existingDoorLocation => existingDoorLocation.name === marker.doorName);
        const coords = marker.getLatLng();

        if (!doorLocation) {
          doorLocation = new IntelliDoorLocation();
          doorLocation.name = marker.doorName;
        } else {
          this.doorLocations = this.doorLocations.filter(a => a.name !== doorLocation.name);
        }

        doorLocation.x = coords.lat;
        doorLocation.y = coords.lng;

        this.doorLocations.push(doorLocation);
        this.updateMap();
      })
    };
  }

  ngAfterViewInit(): void {
   this.doorsService.getDoorsStatus().pipe(
      untilDestroyed(this),
      repeatWhen(complete => complete.pipe(delay(2000))),
      map(doorsResponse => doorsResponse.doors),
      tap(() => {
        this.lastUpdatedService.now();
      })
    ).subscribe(doors => {
      if (!this.isEditing) {
        this.doorMarkers = this.doorMarkers.map(doorMarker => {
          const x = doorMarker.getLatLng().lat;
          const y = doorMarker.getLatLng().lng;
          const door = doors.find(aDoor => aDoor.name === doorMarker.doorName);

          const updatedDoorMarker = this.createDoorMarker(x, y, door);
          updatedDoorMarker.on(this.onDragged(updatedDoorMarker));

          return updatedDoorMarker;
        });
      }
   });
  }

  private createDoorMarker(x: number, y: number, door: IntelliDoor): DoorMarker {
    const doorMarker = new DoorMarker(door, latLng(x, y), {
      draggable: true
    });

    doorMarker.on(this.onDragged(doorMarker));

    return doorMarker;
  }

  private updateMap() {
    const currentMap = this.intelliMapSubject.value;
    currentMap.doors = this.doorLocations;
    this.mapService.saveMap(currentMap).subscribe();
    this.isEditing = false;
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }
}
