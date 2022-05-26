import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { catchError, forkJoin, Observable, of, takeUntil, throwError } from 'rxjs';
import { CauhinhService } from '../cauhinh/cauhinh.service';
import { TailienguonService } from './tailieunguon/tailienguon.service';

@Injectable({
  providedIn: 'root'
})
export class DaotaoResolver implements Resolve<boolean> {
  constructor(
    private _tailienguonService: TailienguonService,
    private _cauhinhService: CauhinhService,
    ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
          this._tailienguonService.getAllTailieunguon(),
          this._cauhinhService.getAllDanhmuc()
    ]);
  }
}
// @Injectable({
//   providedIn: 'root'
// })
// export class DaotaoByUserResolver implements Resolve<boolean> {
//   constructor(
//     private _daotaoService: DaotaoService,
//     private _userService: UserService,
//     ){}
//   User;
//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
//    this._userService.user$.subscribe((data) => { this.User = data;
    
//   }); 
//   return forkJoin([
//     this._daotaoService.getGrouptasksByuser(this.User.id),
//     this._daotaoService.getTasksByuser(this.User.id),
//     this._daotaoService.getDuanByuser(this.User.id),
//     this._daotaoService.getSectionByuser(this.User.id),
//   ]);
//   }
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class DaotaoDuanResolver implements Resolve<any>
// {
//     constructor(
//       private _daotaoService: DaotaoService,
//         private _router: Router
//     )
//     {
//     }
//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
//     {
//         return this._daotaoService.getDuanById(route.paramMap.get('id'))
//                    .pipe(
//                        catchError((error) => {
//                            console.error(error);
//                            const parentUrl = state.url.split('/').slice(0, -1).join('/');
//                            this._router.navigateByUrl(parentUrl);
//                            return throwError(error);
//                        })
//                    );
//     }
//}