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
  private _member: BehaviorSubject<any> = new BehaviorSubject(null);
  private _count: BehaviorSubject<any> = new BehaviorSubject(null);
 constructor(private _httpClient: HttpClient)
  {
    
  }
  get data$(): Observable<any>
  {
      return this._data.asObservable();
  }
  get count$(): Observable<any>
  {
      return this._count.asObservable();
  }
  get Khachhang$(): Observable<any>
  {
      return this._data.asObservable();
  }
  get Member$(): Observable<any>
  {
      return this._member.asObservable();
  }
  CreateData(dulieu): Observable<any>
  {
      return this._httpClient.post(`${environment.ApiURL}/khachhangs/chitiet`,dulieu).pipe(
          tap((response: any) => {
              console.log(response)
          })
      );
  }
  CreateMember(dulieu): Observable<any>
  {
      return this._httpClient.post(`${environment.ApiURL}/khachhangs/khachhang`,dulieu).pipe(
          tap((response: any) => {
              console.log(response)
          })
      );
  }
  GetMember():  Observable<any>
  {
      return this._httpClient.get(`${environment.ApiURL}/khachhangs/khachhang`).pipe(
          tap((member: any) => {
            this._member.next(member);
           // console.log(Character);
          })
      );
  }
  GetData():  Observable<Khachhang[]>
  {
      return this._httpClient.get(`${environment.ApiURL}/khachhangs/chitiet`).pipe(
          tap((khachhang: Khachhang[]) => {
            this._data.next(khachhang);
           // console.log(Character);
          })
      );
  }
  LoadBySDT(SDT):  Observable<any>
  {
      return this._httpClient.get(`${environment.ApiURL}/khachhangs/chitiet/${SDT}`).pipe(
          tap((khachhang) => {
            console.log(khachhang);
            this._data.next(khachhang);
          })
      );
  }
  LoadMore(skip,take):  Observable<any>
  {
      return this._httpClient.get(`${environment.ApiURL}/khachhangs/chitiet/paged?skip=${skip}&take=${take}`).pipe(
          tap((khachhang) => {
            console.log(khachhang);
            this._data.next(khachhang.data);

          })
      );
  }
  CountData():  Observable<any>
  {
      return this._httpClient.get(`${environment.ApiURL}/khachhangs/chitiet/count`).pipe(
          tap((count) => {
            this._count.next(count[1]);
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
