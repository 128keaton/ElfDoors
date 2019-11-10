import {DoorsComponent} from './views/doors/doors.component';
import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {EventsComponent} from './views/events/events.component';

const routes: Routes = [
  {
    path: '',
    component: DoorsComponent,
  },
  {
    path: 'events',
    component: EventsComponent
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
