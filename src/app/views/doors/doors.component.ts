import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IntelliDoorsService} from '../../services/intelli-access/intelli-doors.service';
import {Observable} from 'rxjs';
import {IntelliDoor} from '../../services/intelli-access/models/intelli-door.model';
import {map, tap} from 'rxjs/operators';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {CountdownComponent, CountdownConfig, CountdownEvent} from 'ngx-countdown';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-doors',
  templateUrl: './doors.component.html',
  styleUrls: ['./doors.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.5s ease-out', style({ opacity: '1' })),
      ]),
    ]),
  ],
})
export class DoorsComponent implements OnInit, OnDestroy {
  @ViewChild(CountdownComponent, { static: false }) updateCountdown: CountdownComponent;

  doors: Observable<IntelliDoor[]>;

  // Time to update in seconds
  countdownConfig: CountdownConfig = {
    format: 's',
    leftTime: 25,
    prettyText: text => {
      return `${text} ${text === '1' ? 'second' : 'seconds'} left until update`;
    }
  };

  constructor(private doorsService: IntelliDoorsService) {
  }

  ngOnInit() {
  }

  private updateDoors(event?: CountdownEvent) {
    this.doors = this.doorsService.getDoorsStatus().pipe(
      untilDestroyed(this),
      map(doorStatusResponse => doorStatusResponse.doors),
      tap(() => {
        if (event && event.action === 'done') {
          this.updateCountdown.restart();
        }
      })
    );
  }

  forceUpdateDoors() {
    this.updateDoors({action: 'done', status: 0, left: 0, text: ''});
  }

  ngOnDestroy(): void {
  }
}
