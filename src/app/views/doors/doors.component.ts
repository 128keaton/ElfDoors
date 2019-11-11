import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {IntelliDoor} from '../../services/intelli-access/models/doors/intelli-door.model';
import {delay, map, repeatWhen, tap} from 'rxjs/operators';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {IntelliDoorStatus} from '../../services/intelli-access/models/status/intelli-door-status.enum';
import {LastUpdatedService} from '../../services/last-updated.service';
import {PageTitleService} from '../../services/page-title.service';
import {IntelliDoorsService} from '../../services/intelli-access/services';

@Component({
  selector: 'app-doors',
  templateUrl: './doors.component.html',
  styleUrls: ['./doors.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('true', style({opacity: 1})),
      state('false', style({opacity: 0})),
      transition('1 => 0', animate('.5s ease-out')),
      transition('0 => 1', animate('.5s ease-out'))
    ]),
  ],
})
export class DoorsComponent implements OnInit, OnDestroy {
  doors: Observable<IntelliDoor[]>;
  hasAnimated = false;

  constructor(private doorsService: IntelliDoorsService,
              private lastUpdatedService: LastUpdatedService,
              pageTitleService: PageTitleService) {
    pageTitleService.updatePageTitle('Doors');
  }

  ngOnInit() {
    this.doors = this.doorsService.getDoorsStatus().pipe(
      untilDestroyed(this),
      repeatWhen(complete => complete.pipe(delay(2000))),
      map(doorsResponse => doorsResponse.doors),
      tap(() => {
        this.hasAnimated = true;
        this.lastUpdatedService.now();
      })
    );
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
