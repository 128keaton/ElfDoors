import {EventEmitter, Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import * as titleize from 'titleize';
import {dotenv} from './intelli-access/config/dotenv';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  public readonly titleChanged: EventEmitter<string> = new EventEmitter<string>();

  // tslint:disable-next-line:variable-name
  private _activePage: string;
  private appTitle = dotenv.title;

  constructor(private title: Title) {
    this._activePage = '';
  }

  private static titleize(inputString: string): string {
    return titleize(inputString);
  }

  /**
   * Update the current page title to the 'newPageTitle' value
   * @param newPageTitle - The new title of the page
   */
  public updatePageTitle(newPageTitle: string) {
    if (!newPageTitle) {
      return;
    }

    this.title.setTitle(`${this.appTitle} / ${PageTitleService.titleize(newPageTitle)}`);
    this.titleChanged.emit(this.getPageTitle());
  }

  /**
   * Returns the current page title
   */
  public getPageTitle(): string {
    return this.title.getTitle().split(' / ').slice(-1).join('').toLowerCase();
  }
}
