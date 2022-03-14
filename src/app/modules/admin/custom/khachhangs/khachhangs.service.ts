import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Khachhang } from './khachhang.type';
@Injectable({
  providedIn: 'root'
})
export class KhachhangsService {
  private _data: BehaviorSubject<any> = new BehaviorSubject(null);
  private _Khachhang: BehaviorSubject<any> = new BehaviorSubject(null);
 constructor(private _httpClient: HttpClient)
  {
    
  }
  get data$(): Observable<any>
  {
      return this._data.asObservable();
  }
  get Khachhang$(): Observable<any>
  {
      return this._data.asObservable();
  }
  CreateData(dulieu): Observable<any>
  {
      return this._httpClient.post(`${environment.ApiURL}/khachhangs/chitiet`,dulieu).pipe(
          tap((response: any) => {
              console.log(response)
          })
      );
  }
  GetData():  Observable<Khachhang[]>
  {
      return this._httpClient.get(`${environment.ApiURL}/khachhangs/chitiet`).pipe(
          tap((Character: Khachhang[]) => {
            this._data.next(Character);
           // console.log(Character);
          })
      );
  }
  GetKhachhang():  Observable<Khachhang[]>
  {
      return this._httpClient.get(`${environment.ApiURL}/khachhangs/chitiet`).pipe(
          tap((Khachhang: Khachhang[]) => {
            this._Khachhang.next(Khachhang);
            //console.log(Khachhang);
          })
      );
  }
}
