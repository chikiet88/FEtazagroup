import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, forkJoin, Observable, throwError } from 'rxjs';
import { CauhinhService } from '../../cauhinh/cauhinh.service';
import { Cauhinh } from '../../cauhinh/cauhinh.types';
import { NhanvienService } from './nhanvien.service';
import { Nhanvien } from './nhanvien.type';

@Injectable({
    providedIn: 'root'
})
export class NhanviensNhanvienResolver implements Resolve<any>
{
    constructor(
        private _nhanviensService: NhanvienService,
        private _router: Router
    )
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Nhanvien>
    {
        return this._nhanviensService.getNhanvienById(route.paramMap.get('id'))
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
@Injectable({
    providedIn: 'root'
})
export class NhanviensCauhinhResolver implements Resolve<any>
{
    constructor(
        private _cauhinhsService: CauhinhService,
        private _router: Router,
        private _nhanviensService: NhanvienService
    )
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return forkJoin([
            this._cauhinhsService.getCauhinhs(),
            this._cauhinhsService.getMenus(),
            this._nhanviensService.getNhanviens(),
          ]);
    }
}
