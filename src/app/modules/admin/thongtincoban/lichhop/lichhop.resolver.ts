import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { user } from 'app/mock-api/common/user/data';
import { forkJoin, Observable, of, takeUntil } from 'rxjs';
import { NhanvienService } from '../../baocao/nhanvien/nhanvien.service';
import { CauhinhService } from '../../cauhinh/cauhinh.service';
import { LichhopService } from './lichhop.service';

@Injectable({
  providedIn: 'root'
})
export class LichhopResolver implements Resolve<any> {
  constructor(
    private _cauhinhsService: CauhinhService,
    private _NhanvienService: NhanvienService,
    private _LichhopService: LichhopService,
    ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._cauhinhsService.getCauhinhs(),
      this._NhanvienService.getNhanviens(),
      this._LichhopService.getLichhops(),
    ]);
  }
}

