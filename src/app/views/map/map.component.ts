import {Component, OnDestroy, OnInit} from '@angular/core';
import {IntelliDoorsService} from '../../services/intelli-access/services';
import {LastUpdatedService} from '../../services/last-updated.service';
import {PageTitleService} from '../../services/page-title.service';
import {Observable} from 'rxjs';
import {IntelliDoor} from '../../services/intelli-access/models/doors/intelli-door.model';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {delay, map, repeatWhen, tap} from 'rxjs/operators';
import {IntelliDoorStatus} from '../../services/intelli-access/models/status/intelli-door-status.enum';
import {CdkDragEnd, CdkDragStart} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  doors: Observable<IntelliDoor[]>;
  hasAnimated = false;
  isEditing = true;

  constructor(private doorsService: IntelliDoorsService,
              private lastUpdatedService: LastUpdatedService,
              pageTitleService: PageTitleService) {
    pageTitleService.updatePageTitle('Map');
  }

  dragEnded($event: CdkDragEnd) {
    const { offsetLeft, offsetTop } = $event.source.element.nativeElement;
    const { x, y } = $event.distance;
    const positionX = offsetLeft + x;
    const positionY = offsetTop + y;
    $event.source.element.nativeElement.style.position = 'absolute';


    console.log({ positionX, positionY });
  }

  dragStarted($event: CdkDragStart) {
    $event.source.element.nativeElement.style.position = null;
  }

  ngOnInit() {
    if (this.isEditing === false ) {
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

  ngOnDestroy(): void {
  }
}
