import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { CauhinhService } from '../../cauhinh/cauhinh.service';
import { KhachhangsService } from './khachhangs.service';
@Injectable({
  providedIn: 'root'
})
export class KhachhangsResolver implements Resolve<boolean> {
  constructor(
    private _khachhangsService: KhachhangsService,
    private _cauhinhService: CauhinhService,
    ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
     //this._khachhangsService.GetData(),
    // this._khachhangsService.GetKhachhang(),
     // this._khachhangsService.CountData(),
      this._cauhinhService.getCauhinhs(),
     // this._khachhangsService.GetMember(),
    ]);
  }
}
