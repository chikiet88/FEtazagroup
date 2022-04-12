import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { NhanvienService } from '../baocao/nhanvien/nhanvien.service';
import { CauhinhService } from './cauhinh.service';

@Injectable({
  providedIn: 'root'
})
export class CauhinhMenuResolver implements Resolve<boolean> {
  constructor(
      private _cauhinhService:CauhinhService,
      private _nhanviensService:NhanvienService,
    ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._cauhinhService.getMenus(),
      this._cauhinhService.getCauhinhs(),
      this._nhanviensService.getNhanviens(),
    ]);
  }
}
