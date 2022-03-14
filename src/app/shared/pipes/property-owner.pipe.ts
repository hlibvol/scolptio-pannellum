import { Pipe, PipeTransform } from '@angular/core';
import { Properties } from 'src/app/view/properties/properties.model';

@Pipe({
  name: 'propertyOwner'
})
export class PropertyOwnerPipe implements PipeTransform {

  transform(property: Properties): unknown {
    if(!property)
      return null;
    if(property.ownerNameFormatted)
      return property.ownerNameFormatted;
    else{
      var result = [];
      this.prepareName(result, property, 1); 
      this.prepareName(result, property, 2);
      this.prepareName(result, property, 3);
      this.prepareName(result, property, 4);
    }
    if(property.offerPrice)
      result.push(property.offerPrice);
    else if(property.totalAssessedValue)
      result.push(property.totalAssessedValue)
    return result.toString();
  }
  prepareName(result: string[], property: Properties, i: number):void {
    let name = '';
    if(property[`owner${i}FName`])
      name += property[`owner${i}FName`]
    if(property[`owner${i}MName`])
      name += property[`owner${i}MName`]
    if(property[`owner${i}LName`])
      name += property[`owner${i}LName`]
    if(name)
      result.push(name);
  }

}
