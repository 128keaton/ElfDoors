import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {IntelliDoorsService} from '../../services/intelli-access/intelli-doors.service';
import {BehaviorSubject, Observable, timer} from 'rxjs';
import {IntelliDoor} from '../../services/intelli-access/models/intelli-door.model';
import {map, switchMap} from 'rxjs/operators';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {animate, style, transition, trigger} from '@angular/animations';
import * as eva from 'eva-icons';
import {IntelliDoorStatus} from '../../services/intelli-access/models/status/intelli-door-status.enum';
import {LastUpdatedService} from '../../services/last-updated.service';
import {PageTitleService} from '../../services/page-title.service';

@Component({
  selector: 'app-doors',
  templateUrl: './doors.component.html',
  styleUrls: ['./doors.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({opacity: '0'}),
        animate('.5s ease-out', style({opacity: '1'})),
      ]),
    ]),
  ],
})
export class DoorsComponent implements OnInit, OnDestroy, AfterViewInit {

  doorIdentifiers: Observable<number[]>;
  doors: { door: BehaviorSubject<IntelliDoor>, id: number }[] = [];

  constructor(private doorsService: IntelliDoorsService,
              private lastUpdatedService: LastUpdatedService,
              pageTitleService: PageTitleService) {
    pageTitleService.updatePageTitle('Doors');
  }

  ngAfterViewInit(): void {
    eva.replace();
  }

  ngOnInit() {
    this.doorIdentifiers = this.doorsService.getDoorsStatus().pipe(
      untilDestroyed(this),
      map(doorsResponse => {
        return doorsResponse.doors.map(door => door.id);
      })
    );

    this.doorIdentifiers.subscribe(() => {
      timer(0, 2000).pipe(
        untilDestroyed(this),
        switchMap(() => this.doorsService.getDoorsStatus().pipe(
          untilDestroyed(this),
          map(doorsResponse => doorsResponse.doors)
        ))
      ).subscribe(updatedDoors => {
        this.lastUpdatedService.now();
        updatedDoors.forEach(door => {
          const previousStatus = this.doors.find(status => status.id === door.id);
          if (previousStatus) {
            previousStatus.door.next(door);
          } else {
            this.doors.push({
              door: new BehaviorSubject<IntelliDoor>(door),
              id: door.id
            });
          }
        });
      });
    });
  }

  getDoorSubscriber(id: number): BehaviorSubject<IntelliDoor> {
    const subscriber = this.doors.find(status => status.id === id);
    if (subscriber) {
      return this.doors.find(status => status.id === id).door;
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
