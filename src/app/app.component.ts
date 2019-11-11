import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {LastUpdatedService} from './services/last-updated.service';
import {BehaviorSubject, timer} from 'rxjs';
import {PageTitleService} from './services/page-title.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {ToastrService} from 'ngx-toastr';
import {IntelliEventsService} from './services/intelli-access/services';
import {distinctUntilChanged, switchMap} from 'rxjs/operators';
import {dotenv} from './services/intelli-access/config/dotenv';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({opacity: '0'}),
        animate('.5s ease-out', style({opacity: '1'})),
      ]),
    ]),
  ],
  template: `
      <div class="navigation">
          <h1 class="title">
              {{appTitle}}
              <span id="last_updated" *ngIf="(hasLastUpdated | async)" @fadeIn> - {{lastUpdatedText | async}}</span>
          </h1>
          <div class="links">
              <a class="link" [class.selected]="(currentPageTitle | async) === 'doors'" routerLink="/">Doors</a>
              <a class="link" [class.selected]="(currentPageTitle | async) === 'events'" routerLink="/events">Events</a>
              <a class="link" [class.selected]="(currentPageTitle | async) === 'people'" routerLink="/people">People</a>
          </div>
      </div>
      <div class="content">
          <div class="scroll-wrapper">
              <router-outlet></router-outlet>
          </div>
      </div>
  `
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  lastUpdated: BehaviorSubject<string>;
  lastUpdatedText = new EventEmitter(true);
  currentPageTitle = new EventEmitter(true);
  hasLastUpdated = new EventEmitter(true);
  fetchedEvents = false;
  appTitle = dotenv.title;

  constructor(protected lastUpdatedService: LastUpdatedService,
              protected toastrService: ToastrService,
              protected eventsService: IntelliEventsService,
              protected pageTitleService: PageTitleService) {
    this.lastUpdated = this.lastUpdatedService.lastUpdated;
    this.lastUpdated.subscribe(l => this.lastUpdatedText.emit(l));
    this.pageTitleService.titleChanged.subscribe(pageTitle => this.currentPageTitle.emit(pageTitle));
  }

  ngOnInit(): void {
    this.lastUpdatedService.now();
    timer(0, 2000).pipe(
      untilDestroyed(this),
      switchMap(() => this.eventsService.getEvents()),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    ).subscribe(eventsResponse => {
      const mostRecentEvent = eventsResponse.events[eventsResponse.events.length - 1];

      if (this.fetchedEvents === true && mostRecentEvent) {
        const message = (mostRecentEvent.triggeredReason ? mostRecentEvent.triggeredReason.displayName : mostRecentEvent.rawTriggeredReason);

        this.toastrService.show(message, mostRecentEvent.doorName);
      } else {
        this.fetchedEvents = true;
      }
    });
  }

  ngAfterViewInit(): void {
    this.hasLastUpdated.next(true);
  }

  ngOnDestroy(): void {
  }
}
