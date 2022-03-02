import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CauhinhService } from '../../cauhinh/cauhinh.service';
import { Cauhinh } from '../../cauhinh/cauhinh.types';

@Injectable({
  providedIn: 'root'
})
export class LichhopResolver implements Resolve<any> {
  constructor(
    private _cauhinhsService: CauhinhService,
    private _router: Router
    ){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cauhinh[]> {
    return this._cauhinhsService.getCauhinhs();
  }
}
