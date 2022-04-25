import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Khachhang } from './khtimona.type';
@Injectable({
  providedIn: 'root'
})
export class KhtimonaService {
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
      return this._httpClient.post(`${environment.ApiURL}/khtimona/khtimonachitiet`,dulieu).pipe(
          tap((response: any) => {
              console.log(response)
          })
      );
  }
  CreateMember(dulieu): Observable<any>
  {
      return this._httpClient.post(`${environment.ApiURL}/khtimona/khachhang`,dulieu).pipe(
          tap((response: any) => {
              console.log(response)
          })
      );
  }
  ClearKhachhang():  Observable<Khachhang[]>
  {
      return this._httpClient.get(`${environment.ApiURL}/khtimona/khachhang/clear`).pipe(
          tap((khachhang: Khachhang[]) => {
            this._data.next(khachhang);
           console.log(khachhang);
          })
      );
  }
  GetMember(chinhanh):  Observable<any>
  {
       return this._httpClient.get(`${environment.ApiURL}/khtimona/khachhang/${chinhanh}`).pipe(
          tap((member: any) => {
            this._member.next(member);
            console.log(member);
          })
      );
  }
  GetAllMember():  Observable<any>
  {
       return this._httpClient.get(`${environment.ApiURL}/khtimona/khachhang`).pipe(
          tap((member: any) => {
            this._member.next(member);
          })
      );
  }
  GetData():  Observable<Khachhang[]>
  {
      return this._httpClient.get(`${environment.ApiURL}/khtimona/khtimonachitiet`).pipe(
          tap((khachhang: Khachhang[]) => {
            this._data.next(khachhang);
           //console.log(khachhang);
          })
      );
  }
  LoadByTenKH(TenKH):  Observable<any>
  {
      return this._httpClient.get(`${environment.ApiURL}/khtimona/khtimonachitiet/paged?TenKH=${TenKH}`).pipe(
          tap((khachhang) => {
            console.log(khachhang);
            this._data.next(khachhang);
          })
      );
  }
  LoadBySDT(SDT):  Observable<any>
  {
      console.log(SDT);
      
      return this._httpClient.get(`${environment.ApiURL}/khtimona/khtimonachitiet/paged?SDT=${SDT}`).pipe(
          tap((khachhang) => {
            console.log(khachhang);
            this._data.next(khachhang);
          })
      );
  }
  LoadMore(skip,take):  Observable<any>
  {
      return this._httpClient.get(`${environment.ApiURL}/khtimona/khtimonachitiet/paged?skip=${skip}&take=${take}`).pipe(
          tap((khachhang) => {
            console.log(khachhang);
            this._data.next(khachhang.data);

          })
      );
  }
  CountData():  Observable<any>
  {
      return this._httpClient.get(`${environment.ApiURL}/khtimona/khtimonachitiet/count`).pipe(
          tap((count) => {
            this._count.next(count[1]);
          })
      );
  }
  GetKhachhang():  Observable<Khachhang[]>
  {
      return this._httpClient.get(`${environment.ApiURL}/khtimona/khtimonachitiet`).pipe(
          tap((Khachhang: Khachhang[]) => {
            this._Khachhang.next(Khachhang);
            //console.log(Khachhang);
          })
      );
  }
}
