import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, filter, map, Observable, switchMap, take, tap } from 'rxjs';
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
  GetData():  Observable<any>
  {
      return this._httpClient.get(`${environment.ApiURL}/khtimona/khtimonachitiet`).pipe(
          tap((data) => {
            this._data.next(data);
          })
      );
  }
  CreateData(dulieu): Observable<any>
  {
    return this.data$.pipe(
        take(1),
        switchMap(datas => this._httpClient.post(`${environment.ApiURL}/khtimona/khtimonachitiet`, dulieu).pipe(
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
        switchMap(datas => this._httpClient.patch(`${environment.ApiURL}/khtimona/khtimonachitiet/${id}`, dulieu).pipe(
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
        switchMap(members => this._httpClient.post(`${environment.ApiURL}/khtimona/khachhang`, dulieu).pipe(
            map((result) => {
                this._member.next([result, ...members]);
                return result;
            })
        ))
    );
  }

  UpdateMember(dulieu): Observable<any>
  {
      return this._httpClient.patch(`${environment.ApiURL}/khtimona/khachhang/${dulieu.id}`,dulieu).pipe(
          tap((response: any) => {
             // console.log(response)
          })
      );
  }
  ClearKhachhang():  Observable<Khachhang[]>
  {
      return this._httpClient.get(`${environment.ApiURL}/khtimona/khachhang/clear`).pipe(
          tap((khachhang: Khachhang[]) => {
            this._data.next(khachhang);
         //  console.log(khachhang);
          })
      );
  }
  GetMember(chinhanh):  Observable<any>
  {
       return this._httpClient.get(`${environment.ApiURL}/khtimona/khachhang/${chinhanh}`).pipe(
          tap((member: any) => {
            this._member.next(member);
          })
      );
  }
  GetMemberBySDT(SDT):  Observable<any>
  {
      return this._httpClient.get(`${environment.ApiURL}/khtimona/khachhang/paged?SDT=${SDT}`).pipe(
          tap((khachhang) => {
           // console.log(khachhang);
            this._data.next(khachhang);
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
