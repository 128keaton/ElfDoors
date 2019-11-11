import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, timer} from 'rxjs';
import {IntelliPerson} from '../../services/intelli-access/models/people/intelli-person.model';
import {LastUpdatedService} from '../../services/last-updated.service';
import {PageTitleService} from '../../services/page-title.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {IntelliPeopleService} from '../../services/intelli-access/services';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({opacity: '0'}),
        animate('.5s ease-out', style({opacity: '1'})),
      ]),
    ]),
  ],
})
export class PeopleComponent implements OnInit, OnDestroy {
  people: Observable<IntelliPerson[]>;

  constructor(private peopleService: IntelliPeopleService,
              private lastUpdatedService: LastUpdatedService,
              pageTitleService: PageTitleService) {
    pageTitleService.updatePageTitle('People');
    lastUpdatedService.now();

    this.people = this.peopleService.getPeople().pipe(
      map(peopleResponse => peopleResponse.people.filter(person => {
        return person.cardNumber && person.cardNumber.length > 1 && person.cardStatus && person.cardStatus.length > 1;
      }))
    );
  }

  ngOnInit() {
    timer(0, 2000).pipe(
      untilDestroyed(this)
    ).subscribe(() => this.lastUpdatedService.now());
  }

  ngOnDestroy(): void {
  }
}
