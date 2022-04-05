import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  private _changelogs: BehaviorSubject<any> = new BehaviorSubject(null);
  private _changelog: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private _httpClient: HttpClient) {
  }
  get changelogs$(): Observable<any> {
      return this._changelogs.asObservable();
  }
  get changelog$(): Observable<any> {
      return this._changelog.asObservable();
  }
 
  getAllChanglog(): Observable<any> {
      return this._httpClient.get(`${environment.ApiURL}/changelog`).pipe(
          tap((response: any) => {
              this._changelogs.next(response);
              console.log(response);
              
          })
      );
  }
  CreateChanglog(changelog): Observable<any> {
      return this.changelogs$.pipe(
          take(1),
          switchMap(changelogs => this._httpClient.post(`${environment.ApiURL}/changelog`, changelog).pipe(
              map((result) => {
                  this._changelogs.next([result, ...changelogs]);
                  return result;
              })
          ))
      );
  }
  // UpdateHotro(id, hotro): Observable<any> {
  //     return this.hotros$.pipe(
  //         take(1),
  //         switchMap(hotros => this._httpClient.patch(`${environment.ApiURL}/cauhoithuonggap/${id}`, hotro).pipe(
  //             map((hotro) => {
  //                 const index = hotros.findIndex(item => item.id === id);
  //                 hotros[index] = hotro;
  //                 this._hotros.next(hotros);
  //                 return hotro;
  //             }),
  //             switchMap(hotro => this.hotro$.pipe(
  //                 take(1),
  //                 filter(item => item && item.id === id),
  //                 tap(() => {
  //                     this._hotro.next(hotro);
  //                     return hotro;
  //                 })
  //             ))
  //         ))
  //     );

  // }
  // UpdateTraloi(data): Observable<any> {
  //     return this.hotros$.pipe(
  //         take(1),
  //         switchMap(hotros => this._httpClient.patch(`${environment.ApiURL}/cauhoithuonggap/${data.id}`, data).pipe(
  //             map((hotro) => {
  //                 const index = hotros.findIndex(item => item.id === data.id);
  //                 hotros[index] = hotro;
  //                 this._hotros.next(hotros);
  //                 return hotro;
  //             }),
  //             switchMap(hotro => this.hotro$.pipe(
  //                 take(1),
  //                 filter(item => item && item.id === data.id),
  //                 tap(() => {
  //                     this._hotro.next(hotro);
  //                     return hotro;
  //                 })
  //             ))
  //         ))
  //     );
  // }
  // DeleteCauhoi(data): Observable<any> {
  //     return this._httpClient.delete(`${environment.ApiURL}/cauhoithuonggap/${data.id}`).pipe(
  //       tap(() => {
  //           this.getAllHotro().subscribe();
  //       })
  //   );
  //   }

}
