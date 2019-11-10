import {AfterViewInit, Component, EventEmitter, OnInit} from '@angular/core';
import {LastUpdatedService} from './services/last-updated.service';
import {BehaviorSubject} from 'rxjs';
import {PageTitleService} from './services/page-title.service';
import {animate, style, transition, trigger} from '@angular/animations';

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
          <h1 class="title">ElfDoors
              <span id="last_updated" *ngIf="hasLastUpdated | async" @fadeIn> - {{lastUpdatedText | async}}</span>
          </h1>
          <div class="links">
              <a class="link" [class.selected]="(currentPageTitle | async) === 'doors'" routerLink="/">Doors</a>
              <a class="link" [class.selected]="(currentPageTitle | async) === 'events'" routerLink="/events">Events</a>
          </div>
      </div>
      <div class="content">
          <router-outlet></router-outlet>
      </div>
  `
})
export class AppComponent implements OnInit, AfterViewInit {
  lastUpdated: BehaviorSubject<string>;
  lastUpdatedText = new EventEmitter(true);
  currentPageTitle = new EventEmitter(true);
  hasLastUpdated = new EventEmitter(true);

  constructor(protected lastUpdatedService: LastUpdatedService, protected pageTitleService: PageTitleService) {
    this.lastUpdated = this.lastUpdatedService.lastUpdated;
    this.lastUpdated.subscribe(l => this.lastUpdatedText.emit(l));
    this.pageTitleService.titleChanged.subscribe(pageTitle => this.currentPageTitle.emit(pageTitle));
  }

  ngOnInit(): void {
    this.lastUpdatedService.now();
  }

  ngAfterViewInit(): void {
    this.hasLastUpdated.next(true);
  }
}
