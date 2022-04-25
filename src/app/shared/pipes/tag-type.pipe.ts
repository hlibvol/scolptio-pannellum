import { Pipe, PipeTransform } from '@angular/core';
import { Tag } from 'src/app/view/projects/tag/tag.model';

@Pipe({
  name: 'tagType'
})
export class TagTypePipe implements PipeTransform {

  transform(value: Tag): string {
    if(!value.orgId)
      return 'System';
    else
      return 'Custom';
  }

}
