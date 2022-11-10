import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private _reloadUserInformation$: Subject<void> = new Subject<void>()
  private _scrollAdminLayout$: Subject<{x: number, y: number}> = new Subject<{x: number, y: number}>();
  constructor() { }
  scrollAdminLayout$(): Observable<{x: number, y: number}> {
    return this._scrollAdminLayout$.asObservable();
  }
  scrollAdminLayoutBy(x: number, y: number) {
    this._scrollAdminLayout$.next({x, y});
  }
  public reloadUserInformation$(): Observable<void>{
    return this._reloadUserInformation$.asObservable();
  }
  public broadcastReloadUserInformation(): void {
    this._reloadUserInformation$.next();
  }
}
