import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectListInteractionService {
  private _listUpdated$: Subject<void> = new Subject();
  private _selectedUpdated$: Subject<any> = new Subject();
  public get listUpdated(): Observable<void>{
    return this._listUpdated$.asObservable()
  }
  public get selectedUpdated(): Observable<any>{
    return this._selectedUpdated$.asObservable();
  }
  public broadcastListUpdated(): void {
    this._listUpdated$.next();
  }
  public broadcastSelectedUpdated(newSelected: any){
    this._selectedUpdated$.next(newSelected);
  }
  constructor() { }
}
