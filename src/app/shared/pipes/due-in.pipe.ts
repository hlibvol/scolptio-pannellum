import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dueIn'
})
export class DueInPipe implements PipeTransform {

  transform(value: any): string {
    const endDateMs = new Date(value?.deadline).getTime();
    const date0Ms = new Date(0).getTime();
    const nowMs = Date.now();
    if(endDateMs - date0Ms === 0)
      return null;
    const daysLeft = Math.floor((endDateMs - nowMs) / (1000 * 3600 * 24));
    if(daysLeft > 0)
      return `Due in ${daysLeft} days`;
    else if(daysLeft < 0)
      return `Overdue by ${-daysLeft} days`;
    else
      return `Due today`;
  }

}
