import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { NhanvienService } from './nhanvien.service';
import { Nhanvien } from './nhanvien.type';

@Injectable({
    providedIn: 'root'
})
export class NhanviensResolver implements Resolve<any>
{
    constructor(private _nhanviensService: NhanvienService)
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Nhanvien[]>
    {
        return this._nhanviensService.getNhanviens();
    }
}

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
