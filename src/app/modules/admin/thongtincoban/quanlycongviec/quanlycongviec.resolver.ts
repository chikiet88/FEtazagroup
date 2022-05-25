import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { SharedService } from 'app/shared/shared.service';
import { catchError, forkJoin, Observable, of, takeUntil, throwError } from 'rxjs';
import { NhanvienService } from '../../baocao/nhanvien/nhanvien.service';
import { QuanlycongviecService } from './quanlycongviec.service';

@Injectable({
  providedIn: 'root'
})
export class QuanlycongviecResolver implements Resolve<boolean> {
  constructor(
    private _quanlycongviecService: QuanlycongviecService,
    private _nhanvienServiceService: NhanvienService,
    private _sharedService: SharedService,
    ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._sharedService.getAllUpload(),
      this._quanlycongviecService.getAllGrouptasks(),
      this._quanlycongviecService.getAllTasks(),
      this._quanlycongviecService.getAllDuans(),
      this._quanlycongviecService.getAllSection(),
      this._nhanvienServiceService.getNhanviens(),
    ]);
  }
}
@Injectable({
  providedIn: 'root'
})
export class QuanlycongviecByUserResolver implements Resolve<boolean> {
  constructor(
    private _quanlycongviecService: QuanlycongviecService,
    private _userService: UserService,
    ){}
  User;
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
   this._userService.user$.subscribe((data) => { this.User = data;
    
  }); 
  return forkJoin([
    this._quanlycongviecService.getGrouptasksByuser(this.User.id),
    this._quanlycongviecService.getTasksByuser(this.User.id),
    this._quanlycongviecService.getDuanByuser(this.User.id),
    this._quanlycongviecService.getSectionByuser(this.User.id),
  ]);
  }
}

@Injectable({
  providedIn: 'root'
})
export class QuanlycongviecDuanResolver implements Resolve<any>
{
    constructor(
      private _quanlycongviecService: QuanlycongviecService,
        private _router: Router
    )
    {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._quanlycongviecService.getDuanById(route.paramMap.get('id'))
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