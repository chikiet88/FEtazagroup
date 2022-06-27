import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CongviecService {
  private _duans: BehaviorSubject<any> = new BehaviorSubject(null);
  private _duan: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private _httpClient: HttpClient) {
  }
  get duans$(): Observable<any> {
    return this._duans.asObservable();
  }
  get duan$(): Observable<any> {
    return this._duan.asObservable();
  }
  getAllDuans(): Observable<any> {
    return this._httpClient.get(`${environment.ApiURL}/project`).pipe(
      tap((response: any) => {
        console.log(response);
        
        this._duans.next(response);
      })
    );
  }
  getDuanById(id): Observable<any> {
    // return this._httpClient.get(`${environment.ApiURL}/project/${id}`).pipe(
    //     tap((response: any) => {
    //         this._duan.next(response);
    //     })
    // );
    return this._duans.pipe(
      take(1),
      map((duans) => {
        const duan = duans.find(item => item.id === id) || null;
        this._duan.next(duan);
        return duan;
      }),
      switchMap((duan) => {

        if (!duan) {
          return throwError('Could not found contact with id of ' + id + '!');
        }
        return of(duan);
      })
    );

  }
  getDuanByuser(id): Observable<any> {
    return this._httpClient.get(`${environment.ApiURL}/project/user/${id}`).pipe(
      tap((response: any) => {
        console.log(response);
        this._duans.next(response);
      })
    );
  }
  CreateDuans(duan): Observable<any> {
    return this.duans$.pipe(
      take(1),
      switchMap(duans => this._httpClient.post(`${environment.ApiURL}/project`, duan).pipe(
        map((result) => {
          this._duans.next([result, ...duans]);
          return result;
        })
      ))
    );
  }
  UpdateDuans(duan, id): Observable<any> {
    return this.duans$.pipe(
      take(1),
      switchMap(duans => this._httpClient.patch(`${environment.ApiURL}/project/${id}`, duan).pipe(
        map((duan) => {
          const index = duans.findIndex(item => item.id === id);
          duans[index] = duan;
          this._duans.next(duans);
          return duan;
        }),
        switchMap(duan => this.duan$.pipe(
          take(1),
          filter(item => item && item.id === id),
          tap(() => {
            this._duan.next(duan);
            return duan;
          })
        ))
      ))
    );
  }
  DeleteDuans(id): Observable<any> {
    return this.duans$.pipe(
      take(1),
      switchMap(duans => this._httpClient.delete(`${environment.ApiURL}/project/${id}`).pipe(
        map((isDeleted: boolean) => {
          const index = duans.findIndex(item => item.id === id);
          duans.splice(index, 1);
          this._duans.next(duans);
          return isDeleted;
        })
      ))
    );
  }

}
