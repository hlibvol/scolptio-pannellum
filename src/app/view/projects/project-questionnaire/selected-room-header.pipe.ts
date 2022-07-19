import { Pipe, PipeTransform } from '@angular/core';
import { Question } from './question.model';
import { Room } from './room.model';

@Pipe({
  name: 'selectedRoomHeader'
})
export class SelectedRoomHeaderPipe implements PipeTransform {

  transform<T extends Question>(value: Room<T>): unknown {
    if(!value.isFloorPlan)
      return value.name + ' Room'
    return value.name;
  }

}
