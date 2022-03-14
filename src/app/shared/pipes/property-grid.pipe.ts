import { Pipe, PipeTransform } from '@angular/core';
import { PropertyGridParams } from 'src/app/view/campaign/property-grid-params';
import { Properties } from 'src/app/view/properties/properties.model';
import { PropertyOwnerPipe } from './property-owner.pipe';

@Pipe({
  name: 'propertyGrid'
})
export class PropertyGridPipe implements PipeTransform {

  constructor(private propertyOwnerPipe: PropertyOwnerPipe) { }
  transform(value: Properties[], ...args: unknown[]): Properties[] {
    if(!args || !args[0])
      return null;
    var params:PropertyGridParams = new PropertyGridParams(); args[0] as PropertyGridParams;
    params.sortKey = args[0] as string;
    params.sortReverse = args[1] as boolean;
    params.limit = args[2] as number;
    switch(params.sortKey){
      case 'address':
        if(!params.sortReverse)
          value.sort((a,b) => a.propertyAddress < b.propertyAddress ? -1 : 1)
        else
          value.sort((a,b) => a.propertyAddress > b.propertyAddress ? -1 : 1)
        break;
      case 'owner':
        if(!params.sortReverse)
          value.sort((a,b) => this.propertyOwnerPipe.transform(a) < this.propertyOwnerPipe.transform(b) ? -1 : 1)
        else
          value.sort((a,b) => this.propertyOwnerPipe.transform(a) > this.propertyOwnerPipe.transform(b) ? -1 : 1)
        break;
      case 'price':
        if(!params.sortReverse)
          value.sort((a,b) => a.totalAssessedValue < b.totalAssessedValue ? -1 : 1) // TO-DO: Check for NaN
        else
          value.sort((a,b) => a.totalAssessedValue > b.totalAssessedValue ? -1 : 1)
        break;
      default: return null;
    }
    if(params.limit === -1)
      return value;
    return value.slice(0, params.limit - 1);
  }

}