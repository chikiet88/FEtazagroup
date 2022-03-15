import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { KhachhangsService } from './khachhangs.service';
@Injectable({
  providedIn: 'root'
})
export class KhachhangsResolver implements Resolve<boolean> {
  constructor(
    private _khachhangsService: KhachhangsService
    ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._khachhangsService.GetData(),
      this._khachhangsService.GetKhachhang(),
      this._khachhangsService.CountData(),
    ]);
  }
}
