import { Injectable } from '@angular/core';
import { Properties } from '../view/properties/properties.model';

@Injectable()
export class DataService {
    token: string;
    userInfo: any;
    property: Properties;
}
