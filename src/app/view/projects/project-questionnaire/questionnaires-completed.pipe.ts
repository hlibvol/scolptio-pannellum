import { Pipe, PipeTransform } from '@angular/core';
import { BaseRoom } from './base-room.model';

@Pipe({
  name: 'questionnairesCompleted'
})
export class QuestionnairesCompletedPipe implements PipeTransform {

  transform(value: BaseRoom[]): unknown {
    if(!value || !value.length)
      return null;
    let total: number = value.length;
    let completed = value.filter(x => x.isCompleted).length;
    return `${completed} of ${total} completed`;
  }

}
