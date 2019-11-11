import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {IntelliEventsResponse} from '../models/events/intelli-events.response';
import {distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {dotenv} from '../config/dotenv';
import {HttpClient} from '@angular/common/http';
import {IntelliEventReasonsResponse} from '../models/events/intelli-event-reasons.response';

@Injectable({
  providedIn: 'root'
})
export class IntelliEventsService {
  private config = dotenv;
  private cachedReasonsResponse: IntelliEventReasonsResponse;

  constructor(private httpClient: HttpClient) {
  }

  public getEventReasons(): Observable<IntelliEventReasonsResponse> {
    console.log(this.cachedReasonsResponse);
    if (this.cachedReasonsResponse) {
      return of(this.cachedReasonsResponse);
    } else {
      let url = '/api/infinias/ia/events/reasons';

      if (this.config.host !== null) {
        url = `http://${this.config.host}:${this.config.port}${url}`;
      }

      return this.httpClient.get(url).pipe(
        map(res => {
         const reasonsResponse =  IntelliEventReasonsResponse.fromJSON(res);
         this.cachedReasonsResponse = reasonsResponse;
         return reasonsResponse;
        })
      );
    }
  }

  public getEvents(): Observable<IntelliEventsResponse> {
    let url = '/api/infinias/ia/events/summary';

    if (this.config.host !== null) {
      url = `http://${this.config.host}:${this.config.port}${url}`;
    }

    return this.getEventReasons().pipe(
      switchMap(eventReasonsResponse => {
        return this.httpClient.get(url).pipe(
          map(res => {
            return IntelliEventsResponse.fromJSON(res, eventReasonsResponse.reasons);
          })
        );
      }),
      distinctUntilChanged((x, y) => JSON.stringify(x.events) !== JSON.stringify(y.events))
    );
  }
}
