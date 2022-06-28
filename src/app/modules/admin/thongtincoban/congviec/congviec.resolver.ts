import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SharedService } from 'app/shared/shared.service';
import { catchError, forkJoin, Observable, of, throwError } from 'rxjs';
import { NhanvienService } from '../../baocao/nhanvien/nhanvien.service';
import { CauhinhService } from '../../cauhinh/cauhinh.service';
import { CongviecService } from './congviec.service';

@Injectable({
  providedIn: 'root'
})
export class CongviecResolver implements Resolve<boolean> {
  constructor(
    private _congviecService: CongviecService,
    private _nhanvienServiceService: NhanvienService,
    private _sharedService: SharedService,
    private _cauhinhService: CauhinhService,
    ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._sharedService.getAllUpload(),
      this._congviecService.getAllGrouptasks(),
      this._congviecService.getAllTasks(),
      this._congviecService.getAllDuans(),
      this._nhanvienServiceService.getNhanviens(),
      this._cauhinhService.getCauhinhs(),
    ]);
  }
}
@Injectable({
  providedIn: 'root'
})
export class CongvecsDuanResolver implements Resolve<any>
{
  constructor(
      private _congviecService: CongviecService,
      private _router: Router
  )
  {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
  {
      return this._congviecService.getDuanById(route.paramMap.get('id'))
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
