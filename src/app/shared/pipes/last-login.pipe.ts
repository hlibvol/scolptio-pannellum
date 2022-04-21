import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lastLogin'
})
export class LastLoginPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) { }
  transform(value: unknown): unknown {
    var date = new Date(value?.toString());
    if(date.getFullYear() === 1)
      return null;
    return this.datePipe.transform(date, 'short')
  }

}
