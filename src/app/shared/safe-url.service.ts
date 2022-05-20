import { Injectable } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SafeUrlService {

  constructor() { }
  open(url: SafeUrl): Window {
    let urlStr:string = this.getAsString(url);
    return window.open(urlStr, '_blank');
  }
  getAsString(url: SafeUrl): string {
    if(typeof(url) === 'string')
      return url;
    else
      return url['changingThisBreaksApplicationSecurity'] as string; // TO-DO: Find a better way
  }
}
