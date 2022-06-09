import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, switchMap, take, tap } from 'rxjs';
import { environment } from 'environments/environment';
@Injectable({
    providedIn: 'root'
})
export class CauhoithuonggapService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _hotro: BehaviorSubject<any> = new BehaviorSubject(null);
    private _hotros: BehaviorSubject<any> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get data$(): Observable<any> {
        return this._data.asObservable();
    }
    get hotro$(): Observable<any> {
        return this._hotro.asObservable();
    }
    get hotros$(): Observable<any> {
        return this._hotros.asObservable();
    }
    getAllHotro(): Observable<any> {
        return this._httpClient.get(`${environment.ApiURL}/cauhoithuonggap`).pipe(
            tap((response: any) => {
                this._hotros.next(response);
            })
        );
    }
    CreateHotro(hotro): Observable<any> {
        return this.hotros$.pipe(
            take(1),
            switchMap(hotros => this._httpClient.post(`${environment.ApiURL}/cauhoithuonggap`, hotro).pipe(
                map((result) => {
                    this._hotros.next([result, ...hotros]);
                    return result;
                })
            ))
        );
    }
    UpdateHotro(id, hotro): Observable<any> {
        return this.hotros$.pipe(
            take(1),
            switchMap(hotros => this._httpClient.patch(`${environment.ApiURL}/cauhoithuonggap/${id}`, hotro).pipe(
                map((hotro) => {
                    const index = hotros.findIndex(item => item.id === id);
                    hotros[index] = hotro;
                    this._hotros.next(hotros);
                    return hotro;
                }),
                switchMap(hotro => this.hotro$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {
                        this._hotro.next(hotro);
                        return hotro;
                    })
                ))
            ))
        );

    }
    UpdateTraloi(data): Observable<any> {
        return this.hotros$.pipe(
            take(1),
            switchMap(hotros => this._httpClient.patch(`${environment.ApiURL}/cauhoithuonggap/${data.id}`, data).pipe(
                map((hotro) => {
                    const index = hotros.findIndex(item => item.id === data.id);
                    hotros[index] = hotro;
                    this._hotros.next(hotros);
                    return hotro;
                }),
                switchMap(hotro => this.hotro$.pipe(
                    take(1),
                    filter(item => item && item.id === data.id),
                    tap(() => {
                        this._hotro.next(hotro);
                        return hotro;
                    })
                ))
            ))
        );
    }
    DeleteCauhoi(data): Observable<any> {
        return this._httpClient.delete(`${environment.ApiURL}/cauhoithuonggap/${data.id}`).pipe(
          tap(() => {
              this.getAllHotro().subscribe();
          })
      );
      }

}
