import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { catchError, Observable, of, throwError } from 'rxjs';
import { VetuyendungService } from './vetuyendung.service';
import { Vetuyendung } from './vetuyendung.types';

@Injectable({
  providedIn: 'root'
})
export class VetuyendungsResolver implements Resolve<any> {
     constructor(private _vetuyendungService: VetuyendungService) {}
     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Vetuyendung[]>
     {
         return this._vetuyendungService.getVetuyendungs();
     }
}
@Injectable({
  providedIn: 'root'
})
export class VetuyendungResolver implements Resolve<any> {
     constructor(
      private _vetuyendungService: VetuyendungService,
      private _router: Router 
  )
  {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Vetuyendung>
  {
      return this._vetuyendungService.getVeById(route.paramMap.get('id'))
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
