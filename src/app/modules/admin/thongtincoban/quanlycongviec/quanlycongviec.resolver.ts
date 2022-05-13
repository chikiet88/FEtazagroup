import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { forkJoin, Observable, of, takeUntil } from 'rxjs';
import { QuanlycongviecService } from './quanlycongviec.service';

@Injectable({
  providedIn: 'root'
})
export class QuanlycongviecResolver implements Resolve<boolean> {
  constructor(
    private _quanlycongviecService: QuanlycongviecService,
    ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._quanlycongviecService.getAllGrouptasks(),
      this._quanlycongviecService.getAllTasks(),
      this._quanlycongviecService.getAllDuans(),
      this._quanlycongviecService.getAllSection(),
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
