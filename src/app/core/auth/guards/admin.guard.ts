import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { ta } from 'date-fns/locale';
import { Observable, of, ReplaySubject, switchMap, tap } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {
  status:any;
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _userService: UserService,
    private _navigationService: NavigationService,
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      this._userService.user$.subscribe((user: User) => {
        this._navigationService.menus$.subscribe((menus) => {
          const uuid = menus.find(v => v.link === state.url).uuid;
           this.status = user.Menu[uuid];
           console.log(this.status);
    });
    this.status==undefined?this.status =true:this.status =this.status;
    console.log(this.status);
   }
  );
    return of(this.status);
    // if(state.url){localStorage.setItem('redirectUrl', state.url)} 
    // const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
    // return
    // if(state.url){return this._check(redirectUrl)}
    // else {return this._check(localStorage.getItem('redirectUrl'))}


  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return of(true)
    //return this.canActivate(childRoute,state);
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return of(true)
    // return this._check('/');
  }
}
