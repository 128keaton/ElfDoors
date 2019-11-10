import {Pipe, PipeTransform} from '@angular/core';
import {IntelliDoorStatus} from '../services/intelli-access/models/status/intelli-door-status.enum';

@Pipe({
  name: 'doorAlertStatus'
})
export class DoorAlertStatusPipe implements PipeTransform {

  transform(value: IntelliDoorStatus, lowercase: boolean = false, returnBoolean: boolean = false): any {
    if (returnBoolean && value === IntelliDoorStatus.close) {
      return false;
    } else if (returnBoolean) {
      return true;
    } else if (lowercase) {
      return (value === IntelliDoorStatus.heldOpen ? 'held' : (value === IntelliDoorStatus.forcedOpen ? 'forced' : 'normal'));
    }

    return (value === IntelliDoorStatus.heldOpen ? 'Held' : (value === IntelliDoorStatus.forcedOpen ? 'Forced' : 'Normal'));
  }

}
