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
    const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
    return this._Checkmenu(redirectUrl);
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute,state);
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this._Checkmenu('/');
  }
  private _Checkmenu(redirectUrl): Observable<boolean>
  {
      return this._authService.CheckMenu()
          .pipe(switchMap((checkmenu) => {
            console.log(checkmenu);
            
                 if (!checkmenu )
                  {
                    this._router.navigate(['/wellcome/gioithieu']);
                    return of(false);
                  }
                  else
                  {
                    console.log(checkmenu);
                    
                    const check = checkmenu.find(v=>v.link ===redirectUrl)
                    console.log(check);
                    
                    if(check!=undefined){return of(true)}
                    else {
                     this._router.navigate(['/wellcome/gioithieu']);
                     return of(false)
                  }
                  }
                   })
                );
    }
}
