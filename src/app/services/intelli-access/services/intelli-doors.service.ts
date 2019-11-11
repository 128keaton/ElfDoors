import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map, tap} from 'rxjs/operators';
import {dotenv} from '../config/dotenv';
import {IntelliDoorStatusResponse} from '../models/doors/intelli-door-status.response';

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
      }),
      distinctUntilChanged((x, y) => JSON.stringify(x.doors) !== JSON.stringify(y.doors)),
      tap(res => console.log('Changed', res))
    );
  }
}
