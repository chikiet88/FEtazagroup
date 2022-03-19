import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { environment } from 'environments/environment';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, Observable, tap, take, map, switchMap, throwError, of } from 'rxjs';
import { Cauhinh, Menu } from './cauhinh.types';
@Injectable({
  providedIn: 'root'
})
export class CauhinhService {
  private _Cauhinhs: BehaviorSubject<Cauhinh[] | null> = new BehaviorSubject(null);
  private _Cauhinh: BehaviorSubject<Cauhinh | null> = new BehaviorSubject(null);
  private _Menus: BehaviorSubject<Menu[] | null> = new BehaviorSubject(null);
  private readonly notifier: NotifierService;
  constructor(
    private _httpClient: HttpClient,
    private _notifierService: NotifierService,
    ) { this.notifier = _notifierService; }

  get Cauhinhs$(): Observable<Cauhinh[]>
  {
      return this._Cauhinhs.asObservable();
  } 
  get Cauhinh$(): Observable<Cauhinh>
  {
      return this._Cauhinh.asObservable();
  } 
  get Menus$(): Observable<Menu[]>
  {
      return this._Menus.asObservable();
  } 

  getMenus(): Observable<Menu[]>
  {
      return this._httpClient.get<Menu[]>(`${environment.ApiURL}/navigation`).pipe(
          tap((response: Menu[]) => {
              console.log(response);
              this._Menus.next(response);
          })
      );
  }
  getCauhinhs(): Observable<Cauhinh[]>
  {
      return this._httpClient.get<Cauhinh[]>(`${environment.ApiURL}/cauhinh`).pipe(
          tap((response: Cauhinh[]) => {
              this._Cauhinhs.next(response);
          })
      );
  }
  addCauhinh(title: string): Observable<Cauhinh[]>
  {
      return this._httpClient.post<Cauhinh[]>(`${environment.ApiURL}/cauhinh`, {title}).pipe(
          tap((cauhinhs) => {
                //  console.log(cauhinhs);
               this.notifier.notify('success', 'Thêm Thành Công');
               this.getCauhinhs().subscribe();
          })
      );
  }
  updateCauhinh(cauhinh: Cauhinh): Observable<Cauhinh[]>
  {
      return this._httpClient.patch<Cauhinh[]>(`${environment.ApiURL}/cauhinh/${cauhinh.id}`, cauhinh).pipe(
          tap((cauhinhs) => {
           //  this._Cauhinhs.next(cauhinhs);
              this.notifier.notify('success', 'Cập Nhật Thành Công');
              this.getCauhinhs().subscribe();
          })
      );
  }
 deleteCauhinh(cauhinh: Cauhinh): Observable<Cauhinh>
 {
     return this._httpClient.delete<Cauhinh>(`${environment.ApiURL}/cauhinh/${cauhinh.id}`).pipe(
         tap((cauhinhs) => {
             console.log(cauhinhs);
             this.notifier.notify('success', `Xóa Thành Công`);
             this.getCauhinhs().subscribe();
         })
     );
 }
 selectCauhinh(id:string): Observable<Cauhinh>
 {
    return this._Cauhinhs.pipe(
        take(1),
        map((cauhinhs) => {
            const cauhinh = cauhinhs.find(item => item.id === id) || null;
            this._Cauhinh.next(cauhinh);
            return cauhinh;
        }),
        switchMap((cauhinh) => {
            if ( !cauhinh )
            {
                return throwError('Could not found product with id of ' + id + '!');
            }
            return of(cauhinh);
        })
    );
}

//   createDetail(detail: Detail): Observable<Detail>
//   {
//       return this._httpClient.post<Detail>('api/apps/notes', {detail}).pipe(
//           switchMap(response => this.getDetails().pipe(
//               switchMap(() => this.getNoteById(response.id).pipe(
//                   map(() => response)
//               ))
//           )));
//   }
//   updateDetail(detail: Detail): Observable<Detail>
//   {
//       const updatedDetail = cloneDeep(detail) as any;
//       if ( updatedDetail.cauhinhs.length )
//       {
//         updatedDetail.cauhinhs = updatedDetail.cauhinhs.map(cauhinh => cauhinh.id);
//       }
//       return this._httpClient.patch<Detail>('api/apps/notes', {updatedDetail}).pipe(
//           tap((response) => {
//               this.getDetails().subscribe();
//           })
//       );
//   }
//   deleteDetail(detail: Detail): Observable<boolean>
//   {
//       return this._httpClient.delete<boolean>('api/apps/notes', {params: {id: detail.id}}).pipe(
//           map((isDeleted: boolean) => {
//               this.getDetails().subscribe();
//               return isDeleted;
//           })
//       );
//   }

}
