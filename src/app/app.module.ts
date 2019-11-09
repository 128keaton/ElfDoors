import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {IntelliAccessModule} from './services/intelli-access/intelli-access.module';
import {DoorsComponent} from './views/doors/doors.component';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    DoorsComponent
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
