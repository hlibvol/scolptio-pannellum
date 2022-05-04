import { Injectable } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SafeUrlService {

  constructor() { }
  open(url: SafeUrl){
    if(typeof(url) === 'string')
      window.open(url, '_blank');
    else
      window.open(url['changingThisBreaksApplicationSecurity'], '_blank') // TO-DO: Find a better way
  }
}
