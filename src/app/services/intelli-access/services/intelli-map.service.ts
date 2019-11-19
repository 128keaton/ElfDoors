import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {dotenv} from '../config/dotenv';
import {IntelliMap} from '../models/map/intelli-map.model';

@Injectable({
  providedIn: 'root'
})
export class IntelliMapService {
  private config = dotenv;

  constructor(private httpClient: HttpClient) {
  }

  public getMap(): Observable<IntelliMap> {
    let url = '/get/map';

    if (this.config.host !== null) {
      url = `http://${this.config.host}:${this.config.port}${url}`;
    }

    return this.httpClient.get<IntelliMap>(url);
  }

  public saveMap(updatedMap: IntelliMap): Observable<object> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
      })
    };

    console.log('Saving intelliMap:', updatedMap);
    let url = '/save/map';
    const data = updatedMap.serialize();

    console.log('POSTing data:', data);

    if (this.config.host !== null) {
      url = `http://${this.config.host}:${this.config.port}${url}`;
    }

    return this.httpClient.post(url, data, httpOptions);
  }
}
