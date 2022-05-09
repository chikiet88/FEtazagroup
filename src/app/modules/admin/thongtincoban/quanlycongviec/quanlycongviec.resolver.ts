import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
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
    ]);
  }
}
