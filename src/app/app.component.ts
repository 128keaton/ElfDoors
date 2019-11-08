import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
      <h1 class="title">ElfDoors</h1>
      <div class="content">
          <router-outlet></router-outlet>
      </div>
  `
})
export class AppComponent {
}
