import { Pipe, PipeTransform } from '@angular/core';
import { Room } from './room.model';

@Pipe({
  name: 'selectedRoomHeader'
})
export class SelectedRoomHeaderPipe implements PipeTransform {

  transform(value: Room): unknown {
    if(!value.isFloorPlan)
      return value.name + ' Room'
    return value.name;
  }

}
