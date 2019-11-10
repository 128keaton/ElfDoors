import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {IntelliAccessModule} from './services/intelli-access/intelli-access.module';
import {DoorsComponent} from './views/doors/doors.component';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DoorAlertStatusPipe} from './pipes/door-alert-status.pipe';
import {DoorStatusPipe} from './pipes/door-status.pipe';
import {EventsComponent} from './views/events/events.component';
import {EventDatePipe} from './pipes/event-date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DoorsComponent,
    DoorAlertStatusPipe,
    DoorStatusPipe,
    EventsComponent,
    EventDatePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    IntelliAccessModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
