import {Component, EventEmitter, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IntelliDoorsService} from '../../services/intelli-access/intelli-doors.service';
import {BehaviorSubject, interval, Observable, ReplaySubject, timer} from 'rxjs';
import {IntelliDoor} from '../../services/intelli-access/models/intelli-door.model';
import {map, switchMap, tap} from 'rxjs/operators';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {animate, style, transition, trigger} from '@angular/animations';

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
export class DoorsComponent implements OnInit, OnDestroy {

  doorIdentifiers: Observable<number[]>;
  doors: { door: BehaviorSubject<IntelliDoor>, id: number }[] = [];

  constructor(private doorsService: IntelliDoorsService) {
  }

  ngOnInit() {
    this.doorIdentifiers = this.doorsService.getDoorsStatus().pipe(
      untilDestroyed(this),
      map(doorsResponse => {
        return doorsResponse.doors.map(door => door.id);
      })
    );

    this.doorIdentifiers.subscribe(doors => {
      timer(0, 2000).pipe(
        untilDestroyed(this),
        switchMap(() => this.doorsService.getDoorsStatus().pipe(
          untilDestroyed(this),
          map(doorsResponse => doorsResponse.doors)
        ))
      ).subscribe(updatedDoors => {
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

  ngOnDestroy(): void {
  }
}
