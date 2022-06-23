import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private _scrollAdminLayout$: Subject<{x: number, y: number}> = new Subject<{x: number, y: number}>();
  constructor() { }
  scrollAdminLayout$() {
    return this._scrollAdminLayout$.asObservable();
  }
  scrollAdminLayoutBy(x: number, y: number) {
    this._scrollAdminLayout$.next({x, y});
  }
}
