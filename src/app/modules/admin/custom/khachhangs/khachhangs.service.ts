import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, filter, map, Observable, switchMap, take, tap } from 'rxjs';
import { Khachhang } from './khachhang.type';
@Injectable({
  providedIn: 'root'
})
export class KhachhangsService {
  private _data: BehaviorSubject<any> = new BehaviorSubject(null);
  private _Khachhang: BehaviorSubject<any> = new BehaviorSubject(null);
  private _khachhangs: BehaviorSubject<any> = new BehaviorSubject(null);
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
  get Khachhangs$(): Observable<any>
  {
      return this._khachhangs.asObservable();
  }
  get Member$(): Observable<any>
  {
      return this._member.asObservable();
  }

  CreateData(dulieu): Observable<any>
  {
    return this.data$.pipe(
        take(1),
        switchMap(datas => this._httpClient.post(`${environment.ApiURL}/khachhangs/chitiet`, dulieu).pipe(
            map((result) => {
                this._data.next([result, ...datas]);
                return result;
            })
        ))
    );
  }
  UpdateData(dulieu,id): Observable<any> {
    return this.data$.pipe(
        take(1),
        switchMap(datas => this._httpClient.patch(`${environment.ApiURL}/khachhangs/chitiet/${id}`, dulieu).pipe(
            map((data) => {
                const index = datas.findIndex(item => item.id === id);
                datas[index] = data;
                this._data.next(datas);
                return data;
            }),
            switchMap(data => this.data$.pipe(
                take(1),
                filter(item => item && item.id === id),
                tap(() => {
                    this._data.next(data);
                    return data;
                })
            ))
        ))
    );
}
  CreateMember(dulieu): Observable<any>
  {
    return this.Member$.pipe(
        take(1),
        switchMap(members => this._httpClient.post(`${environment.ApiURL}/khachhangs/khachhang`, dulieu).pipe(
            map((result) => {
                this._member.next([result, ...members]);
                return result;
            })
        ))
    );
  }

  UpdateMember(dulieu): Observable<any>
  {
      return this._httpClient.patch(`${environment.ApiURL}/khachhangs/khachhang/${dulieu.id}`,dulieu).pipe(
          tap((response: any) => {
              console.log(response)
          })
      );
  }
  GetMember(chinhanh):  Observable<any>
  {
       return this._httpClient.get(`${environment.ApiURL}/khachhangs/khachhang/${chinhanh}`).pipe(
          tap((member: any) => {
            this._member.next(member);
            console.log(member);
          })
      );
  }
  GetMemberBySDT(SDT):  Observable<any>
  {
      return this._httpClient.get(`${environment.ApiURL}/khachhangs/khachhang/paged?SDT=${SDT}`).pipe(
          tap((khachhang) => { 
              console.log(khachhang);
            
           // this._data.next(khachhang);
            return khachhang;
          })
      );
  }
  GetAllMember():  Observable<any>
  {
       return this._httpClient.get(`${environment.ApiURL}/khachhangs/khachhang`).pipe(
          tap((member: any) => {
            this._member.next(member);
          })
      );
  }
  GetData():  Observable<Khachhang[]>
  {
      return this._httpClient.get(`${environment.ApiURL}/khachhangs/chitiet`).pipe(
          tap((khachhang: Khachhang[]) => {
            this._data.next(khachhang);
           //console.log(khachhang);
          })
      );
  }
  GetDataByDay(BD,KT):  Observable<any>
  {
      return this._httpClient.get(`${environment.ApiURL}/khachhangs/chitiet/page?batdau=${BD}&ketthuc=${KT}`).pipe(
          tap((data) => {
              console.log(data);
              
            this._data.next(data);
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
