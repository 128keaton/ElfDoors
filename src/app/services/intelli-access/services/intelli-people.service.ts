import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {dotenv} from '../config/dotenv';
import {IntelliPeopleResponse} from '../models/people/intelli-people.response';

@Injectable({
  providedIn: 'root'
})
export class IntelliPeopleService {
  private config = dotenv;

  constructor(private httpClient: HttpClient) {
  }

  public getPeople(): Observable<IntelliPeopleResponse> {
    let url = '/api/infinias/ia/people';

    if (this.config.host !== null) {
      url = `http://${this.config.host}:${this.config.port}${url}`;
    }

    return this.httpClient.get(url).pipe(
      map((res: {success: boolean, data: any}) => {
        if (res.success && res.data) {
          return IntelliPeopleResponse.fromJSON(res.data);
        }
      })
    );
  }

}
