import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { user } from 'app/mock-api/common/user/data';
import { catchError, forkJoin, Observable, of, takeUntil, throwError } from 'rxjs';
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
@Injectable({
  providedIn: 'root'
})
export class LichhopDetailResolver implements Resolve<any> {
  constructor(
    private _cauhinhsService: CauhinhService,
    private _NhanvienService: NhanvienService,
    private _LichhopService: LichhopService,
    private _router: Router,
    ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    return this._LichhopService.getLichopById(route.paramMap.get('id'))
    .pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            this._router.navigateByUrl(parentUrl);
            return throwError(error);
        })
    );
  }
}

