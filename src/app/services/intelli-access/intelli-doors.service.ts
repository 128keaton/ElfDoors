import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IntelliDoorStatusResponse} from './models/intelli-door-status.response';
import {map} from 'rxjs/operators';
import {dotenv} from './config/dotenv';

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
      url = `http://localhost:${this.config.port}/api/infinias/ia/doors/status`;
    }

    return this.httpClient.get(url).pipe(
      map(res => {
        return IntelliDoorStatusResponse.fromJSON(res);
      })
    );
  }
}
