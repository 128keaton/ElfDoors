import { Injectable } from '@angular/core';

/**
 * Global configuration
 */
@Injectable({
  providedIn: 'root',
})
export class IntelliAPIConfiguration {
  endpointURL?: string;
  username?: string;
  password?: string;
  protocol?: string;
  port?: string;
}

/**
 * Parameters for `IntelliModule.forRoot()`
 */
export interface IntelliAPIParams {
  endpointURL?: string;
  username?: string;
  password?: string;
  protocol?: string;
  port?: string;
}
