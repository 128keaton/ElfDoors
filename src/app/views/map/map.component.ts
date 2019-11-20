import {AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {IntelliDoorsService} from '../../services/intelli-access/services';
import {LastUpdatedService} from '../../services/last-updated.service';
import {PageTitleService} from '../../services/page-title.service';
import {Observable} from 'rxjs';
import {IntelliDoor} from '../../services/intelli-access/models/doors/intelli-door.model';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {delay, map, repeatWhen, tap} from 'rxjs/operators';
import {IntelliDoorStatus} from '../../services/intelli-access/models/status/intelli-door-status.enum';
import {CdkDragEnd, CdkDragStart} from '@angular/cdk/drag-drop';
import {IntelliMap} from '../../services/intelli-access/models/map/intelli-map.model';
import {IntelliMapService} from '../../services/intelli-access/services/intelli-map.service';
import {IntelliDoorLocation} from '../../services/intelli-access/models/map/intelli-door-location.model';
import {PositionedDoorDirective} from '../../components/positioned-door/positioned-door.directive';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  doors: Observable<IntelliDoor[]>;
  hasAnimated = false;
  isEditing = true;
  currentMap: IntelliMap;
  doorLocations: IntelliDoorLocation[] = [];
  @ViewChildren(PositionedDoorDirective) positionedDoorElements: QueryList<PositionedDoorDirective>;


  constructor(private doorsService: IntelliDoorsService,
              private mapService: IntelliMapService,
              private lastUpdatedService: LastUpdatedService,
              pageTitleService: PageTitleService) {
    pageTitleService.updatePageTitle('Map');
  }

  setDoorLocations(): void {
    console.log('Iterating over', this.positionedDoorElements.length);
    console.log('With door locations', this.doorLocations);

    this.positionedDoorElements.changes.subscribe(() => {
      this.updatePositionedDoors();
    });
  }

  private updatePositionedDoors() {
    this.positionedDoorElements.forEach(doorElement => {
      if (doorElement.door && doorElement.door.name) {
        const doorLocation = this.doorLocations.find(existingDoorLocation => existingDoorLocation.name === doorElement.door.name);
        if (doorLocation) {
          doorElement.doorLocation = doorLocation;
        }
      }
    });
  }

  dragEnded($event: CdkDragEnd) {
    const doorsDockWrapper = document.body.getElementsByClassName('doors-available').item(0) as HTMLElement;
    const isColliding = this.isColliding($event.source.element.nativeElement, doorsDockWrapper);
    const draggedDoor: IntelliDoor = $event.source.data;
    const css = $event.source.element.nativeElement.style.transform;

    let doorLocation: IntelliDoorLocation = this.doorLocations.find(existingDoorLocation => existingDoorLocation.name === draggedDoor.name);

    if (!doorLocation) {
      doorLocation = new IntelliDoorLocation();
      doorLocation.name = draggedDoor.name;
      doorLocation.css = (isColliding ? null : css);
      this.doorLocations.push(doorLocation);
    } else {
      doorLocation.name = draggedDoor.name;
      doorLocation.css = (isColliding ? null : css);
    }


    if (this.currentMap) {
      this.currentMap.doors = this.doorLocations;
      this.mapService.saveMap(this.currentMap).subscribe(res => console.log(res));
      this.updatePositionedDoors();
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
  }

  ngOnInit() {
    if (this.isEditing === false) {
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

  getIcon(door: IntelliDoor): string {
    if (door.status !== IntelliDoorStatus.close) {
      return 'eva-unlock-outline';
    }
    return 'eva-lock-outline';
  }

  getAlertIcon(door: IntelliDoor): string {
    switch (door.status) {
      case IntelliDoorStatus.heldOpen:
        return 'eva-alert-circle';
      case IntelliDoorStatus.forcedOpen:
        return 'eva-alert-circle';
    }
  }

  private isColliding(element1: HTMLElement, element2: HTMLElement): boolean {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return !(
      rect1.top > rect2.bottom ||
      rect1.right < rect2.left ||
      rect1.bottom < rect2.top ||
      rect1.left > rect2.right
    );
  }

  ngOnDestroy(): void {
  }
}