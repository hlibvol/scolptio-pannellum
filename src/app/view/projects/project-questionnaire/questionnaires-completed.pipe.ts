import { Pipe, PipeTransform } from '@angular/core';
import { Question } from './question.model';
import { Room } from './room.model';

@Pipe({
  name: 'questionnairesCompleted'
})
export class QuestionnairesCompletedPipe implements PipeTransform {

  transform<T extends Question>(value: Room<T>[]): unknown {
    if(!value || !value.length)
      return null;
    let total: number = value.length;
    let completed = value.filter(x => x.isCompleted).length;
    return `${completed} of ${total} completed`;
  }

}
