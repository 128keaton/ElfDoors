import {Injectable, isDevMode} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IntelliDoorStatusResponse} from './models/intelli-door-status.response';
import {map} from 'rxjs/operators';
import {IntelliAPIConfiguration, IntelliAPIParams} from './intelli-api.configuration';
import {Burly} from 'kb-burly';

@Injectable({
  providedIn: 'root'
})
export class IntelliDoorsService {
  // tslint:disable-next-line:variable-name
  constructor(private httpClient: HttpClient, private _apiConfiguration: IntelliAPIConfiguration) {
    if (!_apiConfiguration) {
      throw new Error('No IntelliM API Configuration.');
    }
  }

  public getDoorsStatus(): Observable<IntelliDoorStatusResponse> {
    const url = Burly(this.baseURL)
      .addSegment('/infinias/ia/doors/status')
      .addParam('username', this.apiConfiguration.username)
      .addParam('password', this.apiConfiguration.password)
      .get;

    console.log(url);
    return this.httpClient.get(url).pipe(
      map(res => {
        return IntelliDoorStatusResponse.fromJSON(res);
      })
    );
  }

  private get baseURL(): string {
    if (isDevMode()) {
      return '/proxy';
    }

    return `${this.apiConfiguration.protocol}://${this.apiConfiguration.endpointURL}:${this.apiConfiguration.port}`;
  }

  private get apiConfiguration(): IntelliAPIConfiguration {
    const defaults: IntelliAPIConfiguration = {
      username: 'admin',
      password: 'admin',
      protocol: 'http',
      port: '18779',
      endpointURL: 'localhost'
    };

    return {...defaults, ...this._apiConfiguration};
  }
}
