import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Character,Khachhang } from './character.model';

@Injectable({
  providedIn: 'root'
})
export class ThongkekhService {
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
      return this._httpClient.post(`${environment.ApiURL}/thongkekh`,dulieu).pipe(
          tap((response: any) => {
              console.log(response)
          })
      );
  }
  GetData():  Observable<Khachhang[]>
  {
      return this._httpClient.get(`${environment.ApiURL}/thongkekh`).pipe(
          tap((Character: Khachhang[]) => {
            this._data.next(Character);
           // console.log(Character);
          })
      );
  }
  GetKhachhang():  Observable<Khachhang[]>
  {
      return this._httpClient.get(`${environment.ApiURL}/thongkekh`).pipe(
          tap((Khachhang: Khachhang[]) => {
            this._Khachhang.next(Khachhang);
            //console.log(Khachhang);
          })
      );
  }
}