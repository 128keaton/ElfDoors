import {Pipe, PipeTransform} from '@angular/core';
import {IntelliDoorStatus} from '../services/intelli-access/models/status/intelli-door-status.enum';

@Pipe({
  name: 'doorStatus'
})
export class DoorStatusPipe implements PipeTransform {

  transform(value: IntelliDoorStatus): any {
    if (value === IntelliDoorStatus.heldOpen || value === IntelliDoorStatus.open || value === IntelliDoorStatus.forcedOpen) {
      return 'Open';
    }

    return 'Closed';
  }

}
