import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CauhoiService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _hotros: BehaviorSubject<any> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient)
    {
    }
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }
    get hotros$(): Observable<any>
    {
        return this._hotros.asObservable();
    }
    getAllHotro(): Observable<any>
    {
        return this._httpClient.get(`${environment.ApiURL}/cauhoithuonggap`).pipe(
            tap((response: any) => {
                this._hotros.next(response);
            })
        );
    }
    CreateHotro(hotro): Observable<any>
    {
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
}
