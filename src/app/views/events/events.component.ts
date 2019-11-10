import {Component, OnDestroy, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {IntelliDoorsService} from '../../services/intelli-access/intelli-doors.service';
import {LastUpdatedService} from '../../services/last-updated.service';
import {PageTitleService} from '../../services/page-title.service';
import {Observable, timer} from 'rxjs';
import {IntelliEvent} from '../../services/intelli-access/models/intelli-event.model';
import {map, switchMap, tap} from 'rxjs/operators';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({opacity: '0'}),
        animate('.5s ease-out', style({opacity: '1'})),
      ]),
    ]),
  ],
})
export class EventsComponent implements OnInit, OnDestroy {
  events: Observable<IntelliEvent[]>;

  constructor(private doorsService: IntelliDoorsService,
              private lastUpdatedService: LastUpdatedService,
              pageTitleService: PageTitleService) {
    pageTitleService.updatePageTitle('Events');
    lastUpdatedService.now();

    this.events = this.doorsService.getEvents().pipe(
      map(eventsResponse => eventsResponse.events)
    );
  }

  ngOnInit() {
    this.events = timer(0, 2000).pipe(
      untilDestroyed(this),
      switchMap(() => this.doorsService.getEvents().pipe(
        map(eventsResponse => eventsResponse.events)
      )),
      tap(() => this.lastUpdatedService.now())
    );
  }

  ngOnDestroy(): void {
  }
}
