import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, ReplaySubject} from 'rxjs';
import {delay, distinctUntilChanged, map, repeatWhen, takeUntil, tap} from 'rxjs/operators';
import {dotenv} from '../config/dotenv';
import {IntelliDoorStatusResponse} from '../models/doors/intelli-door-status.response';
import {IntelliDoor} from '../models/doors/intelli-door.model';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Injectable({
  providedIn: 'root'
})
export class IntelliDoorsService {
  private config = dotenv;
  private doors = new ReplaySubject<IntelliDoor[]>();
  private isWatching = false;

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



  public subscribeToChanges(onDoor: IntelliDoor): Observable<IntelliDoor> {
    if (!this.isWatching) {
      this.startWatching();
    }

    return this.doors.pipe(
      map(doors => {
        return doors.find(door => door.name === onDoor.name);
      })
    );
  }

  private startWatching() {
    this.isWatching = true;
    this.getDoorsStatus().pipe(
      takeUntil(of(!this.isWatching)),
      repeatWhen(complete => complete.pipe(delay(2000))),
      map(doorsResponse => doorsResponse.doors)
    );
  }
}
