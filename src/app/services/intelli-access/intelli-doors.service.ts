import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IntelliDoorStatusResponse} from './models/intelli-door-status.response';
import {map} from 'rxjs/operators';
import {dotenv} from './config/dotenv';
import {IntelliEventsResponse} from './models/intelli-events.response';

@Injectable({
  providedIn: 'root'
})
export class IntelliDoorsService {
  private config = dotenv;

  constructor(private httpClient: HttpClient) {
  }

  public getDoorsStatus(): Observable<IntelliDoorStatusResponse> {
    let url = '/api/infinias/ia/doors/status';

    if (this.config.host !== null) {
      url = `http://${this.config.host}:${this.config.port}${url}`;
    }

    return this.httpClient.get(url).pipe(
      map(res => {
        return IntelliDoorStatusResponse.fromJSON(res);
      })
    );
  }

  public getEvents(): Observable<IntelliEventsResponse> {
    let url = '/api/infinias/ia/events/summary';

    if (this.config.host !== null) {
      url = `http://${this.config.host}:${this.config.port}${url}`;
    }

    return this.httpClient.get(url).pipe(
      map(res => {
        return IntelliEventsResponse.fromJSON(res);
      })
    );
  }
}
