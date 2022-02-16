import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { environment } from 'environments/environment';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, Observable, tap, take, map, switchMap, throwError, of } from 'rxjs';
import { Cauhinh } from './cauhinh.types';
@Injectable({
  providedIn: 'root'
})
export class CauhinhService {
  private _Cauhinhs: BehaviorSubject<Cauhinh[] | null> = new BehaviorSubject(null);
  private _Cauhinh: BehaviorSubject<Cauhinh | null> = new BehaviorSubject(null);
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
  getCauhinhs(): Observable<Cauhinh[]>
  {
      return this._httpClient.get<Cauhinh[]>(`${environment.ApiURL}/cauhinh`).pipe(
          tap((response: Cauhinh[]) => {
              this._Cauhinhs.next(response);
          })
      );
  }
  getCauhinhById(id: number): Observable<Cauhinh>
  {
      return this._Cauhinhs.pipe(
          take(1),
          map((cauhinhs) => {
              const cauhinh = cauhinhs.find(value => value.id === id) || null;
              this._Cauhinh.next(cauhinh);
              return cauhinh;
          }),
          switchMap((cauhinh) => {

              if ( !cauhinh )
              {
                  return throwError('Could not found the cauhinh with id of ' + id + '!');
              }

              return of(cauhinh);
          })
      );
  }
  addTask(cauhinh: Cauhinh, task: string): Observable<Cauhinh>
  {
      return this._httpClient.post<Cauhinh>('api/apps/cauhinhs/tasks', {
          cauhinh,
          task
      }).pipe(switchMap(() => this.getCauhinhs().pipe(
          switchMap(() => this.getCauhinhById(cauhinh.id))
      )));
  }
   addCauhinh(title: string): Observable<Cauhinh[]>
   {
       return this._httpClient.post<Cauhinh[]>(`${environment.ApiURL}/cauhinh`, {title}).pipe(
           tap((cauhinhs) => {
               console.log(cauhinhs);
                //this._Cauhinhs.next(cauhinhs[0].Ngaytao);
                this.notifier.notify('success', 'Thêm Thành Công');
                this.getCauhinhs().subscribe();
           })
       );
   }

   updateCauhinh(cauhinh: Cauhinh): Observable<Cauhinh[]>
   {
       console.log(cauhinh);
       return this._httpClient.patch<Cauhinh[]>(`${environment.ApiURL}/cauhinh/${cauhinh.id}`, {cauhinh}).pipe(
           tap((cauhinhs) => {
            this.notifier.notify('success', 'Cập Nhật Thành Công');
               this.getCauhinhs().subscribe();
               //this._Cauhinhs.next(cauhinhs);
           })
       );
   }



  deleteCauhinh(cauhinh: Cauhinh): Observable<Cauhinh[]>
  {
      return this._httpClient.delete<Cauhinh[]>(`${environment.ApiURL}/cauhinh/${cauhinh.id}`).pipe(
          tap((cauhinhs) => {
              console.log(cauhinhs);
              this.notifier.notify('success', `Xóa Thành Công`);
              this.getCauhinhs().subscribe();
             // this._Cauhinhs.next(cauhinhs);
          })
      );
  }

}
