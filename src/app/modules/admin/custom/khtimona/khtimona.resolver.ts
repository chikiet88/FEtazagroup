import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { CauhinhService } from '../../cauhinh/cauhinh.service';
import { KhtimonaService } from './khtimona.service';
@Injectable({
  providedIn: 'root'
})
export class KhtimonaResolver implements Resolve<boolean> {
  constructor(
    private _khtimonaService: KhtimonaService,
    private _cauhinhService: CauhinhService,
    ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
     //this._khtimonaService.GetData(),
    // this._khtimonaService.GetKhachhang(),
     // this._khtimonaService.CountData(),
      this._cauhinhService.getCauhinhs(),
     // this._khtimonaService.GetMember(),
    ]);
  }
}
