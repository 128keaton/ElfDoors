import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LastUpdatedService {
  lastUpdated = new BehaviorSubject<string>((new Date()).toLocaleString());

  public now() {
    this.lastUpdated.next((new Date()).toLocaleTimeString('en-US'));
  }
}
