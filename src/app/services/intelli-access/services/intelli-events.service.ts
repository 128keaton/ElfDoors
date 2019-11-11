import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IntelliEventsResponse} from '../models/events/intelli-events.response';
import {map, switchMap} from 'rxjs/operators';
import {dotenv} from '../config/dotenv';
import {HttpClient} from '@angular/common/http';
import {IntelliEventReasonsResponse} from '../models/events/intelli-event-reasons.response';
import {IntelliEventReason} from '../models/events/intelli-event-reason.model';

@Injectable({
  providedIn: 'root'
})
export class IntelliEventsService {
  private config = dotenv;

  constructor(private httpClient: HttpClient) {
  }

  public getEventReasons(): Observable<IntelliEventReasonsResponse> {
    let url = '/api/infinias/ia/events/reasons';

    if (this.config.host !== null) {
      url = `http://${this.config.host}:${this.config.port}${url}`;
    }

    return this.httpClient.get(url).pipe(
      map(res => {
        return IntelliEventReasonsResponse.fromJSON(res);
      })
    );
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
    );
  }
}
