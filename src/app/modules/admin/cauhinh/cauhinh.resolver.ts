import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { CauhinhService } from './cauhinh.service';

@Injectable({
  providedIn: 'root'
})
export class CauhinhResolver implements Resolve<boolean> {
  constructor(private _cauhinhService:CauhinhService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._cauhinhService.getMenus(),
    ]);
  }
}
