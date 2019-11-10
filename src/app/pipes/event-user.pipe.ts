import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'eventUser'
})
export class EventUserPipe implements PipeTransform {

  transform(value: string): any {
    if (!value) {
      return null;
    }

    const fullName = value.split(',');

    if (fullName.length > 1) {
      return `${fullName[1]} ${fullName[0]}`;
    }
  }
}
