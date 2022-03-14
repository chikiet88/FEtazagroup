import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { ThongkekhService } from './thongkekh.service';

@Injectable({
  providedIn: 'root'
})
export class ThongkekhResolver implements Resolve<boolean> {
  constructor(
    private _thongkekhService: ThongkekhService,
    ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._thongkekhService.GetData(),
      this._thongkekhService.GetKhachhang()
    ]);
  }
}
