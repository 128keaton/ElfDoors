import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventDate'
})
export class EventDatePipe implements PipeTransform {

  transform(value: string): any {
    const date = new Date(value);

    if (date) {
      return 'On ' + date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
    }

    return value;
  }

}
