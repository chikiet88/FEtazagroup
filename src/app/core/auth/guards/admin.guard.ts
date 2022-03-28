import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {

  constructor(
    private _authService: AuthService,
    private _router: Router
)
{
}
canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
{
  const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
  return this._check(redirectUrl);
}
canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
{
  return this.canActivate(childRoute,state);
}
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean
  {
      return this._check('/');
  }

  private _check(redirectURL: string): Observable<boolean>
  {                            
      return this._authService.checkAdmin(redirectURL)
                 .pipe(
                     switchMap((res) => {
                         if (!res)
                         {
                             this._router.navigate(['/wellcome/gioithieu']);
                             return of(res);
                         }
                         return of(true);
                     })
                 );
   }
}
