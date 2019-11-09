import {NgModule, Optional, SkipSelf} from '@angular/core';
import {IntelliDoorsService} from './intelli-doors.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    IntelliDoorsService,
  ],
})
export class IntelliAccessModule {
  constructor(@Optional() @SkipSelf() parentModule: IntelliAccessModule, @Optional() http: HttpClient) {
    if (parentModule) {
      throw new Error('IntelliAccessModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
        'See also https://github.com/angular/angular/issues/20575');
    }
  }
}
