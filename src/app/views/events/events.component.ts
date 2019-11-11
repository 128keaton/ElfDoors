import {Component, OnDestroy, OnInit} from '@angular/core';
import {animate, animateChild, query, stagger, state, style, transition, trigger} from '@angular/animations';
import {LastUpdatedService} from '../../services/last-updated.service';
import {PageTitleService} from '../../services/page-title.service';
import {Observable, timer} from 'rxjs';
import {IntelliEvent} from '../../services/intelli-access/models/events/intelli-event.model';
import {distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {IntelliEventsService} from '../../services/intelli-access/services';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('true' , style({ opacity: 1})),
      state('false', style({ opacity: 0 })),
      transition('1 => 0', animate('.5s ease-out')),
      transition('0 => 1', animate('.5s ease-out'))
    ]),
  ],
})
export class EventsComponent implements OnInit, OnDestroy {
  events: Observable<IntelliEvent[]>;
  hasAnimated = false;

  constructor(private eventsService: IntelliEventsService,
              private lastUpdatedService: LastUpdatedService,
              pageTitleService: PageTitleService) {
    pageTitleService.updatePageTitle('Events');
    lastUpdatedService.now();

    this.events = this.eventsService.getEvents().pipe(
      map(eventsResponse => eventsResponse.events)
    );
  }

  ngOnInit() {
    this.events = timer(0, 2000).pipe(
      untilDestroyed(this),
      distinctUntilChanged(),
      switchMap(() => this.eventsService.getEvents().pipe(
        map(eventsResponse => eventsResponse.events)
      )),
      tap(() => {
        this.hasAnimated = true;
        this.lastUpdatedService.now();
      })
    );
  }

  ngOnDestroy(): void {
  }
}
