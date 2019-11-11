import { Pipe, PipeTransform } from '@angular/core';
import {IntelliEventReason} from '../services/intelli-access/models/events/intelli-event-reason.model';

@Pipe({
  name: 'eventIcon'
})
export class EventIconPipe implements PipeTransform {

  transform(reason: IntelliEventReason): any {
    if (reason && reason.id) {
      switch (reason.id) {
        case 11:
          return 'eva-unlock-outline';
        case 12:
          return 'eva-unlock-outline';
        case 18:
          return 'eva-arrow-up-outline';
        case 22:
          return 'eva-clock-outline';
        case 44:
          return 'eva-alert-triangle-outline';
        case 45:
          return 'eva-alert-triangle-outline';
        case 48:
          return 'eva-log-out-outline';
        case 51:
          return 'eva-sync-outline';
        case 55:
          return 'eva-settings-2-outline';
        case 56:
          return 'eva-settings-2-outline';
        case 68:
          return 'eva-wifi-off-outline';
        case 19:
          return 'eva-wifi-outline';
        case 69:
          return 'eva-wifi-outline';
        case 47:
          return 'eva-checkmark-outline';
        case 76:
          return 'eva-alert-circle-outline';
        default:
          return 'eva-activity';
      }
    }
    return 'eva-activity';
  }

}
