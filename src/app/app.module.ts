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
import {EventUserPipe} from './pipes/event-user.pipe';
import {PeopleComponent} from './views/people/people.component';
import {EventIconPipe} from './pipes/event-icon.pipe';
import {ToastrModule} from 'ngx-toastr';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MapComponent} from './views/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    DoorsComponent,
    DoorAlertStatusPipe,
    DoorStatusPipe,
    EventsComponent,
    EventDatePipe,
    EventUserPipe,
    PeopleComponent,
    EventIconPipe,
    MapComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    DragDropModule,
    AppRoutingModule,
    IntelliAccessModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      preventDuplicates: true,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
