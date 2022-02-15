import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Vetuyendung, Vitri } from './vetuyendung';

@Injectable({
  providedIn: 'root'
})
export class VetuyendungService {
  private _vetuyendungs: BehaviorSubject<Vetuyendung[] | null> = new BehaviorSubject(null);
  private _vitris: BehaviorSubject<Vitri[] | null> = new BehaviorSubject(null);

  constructor() { }

  get vetuyendungs$(): Observable<Vetuyendung[]>
  {
      return this._vetuyendungs.asObservable();
  }
  get vitris$(): Observable<Vitri[]>
  {
      return this._vitris.asObservable();
  } 


}
