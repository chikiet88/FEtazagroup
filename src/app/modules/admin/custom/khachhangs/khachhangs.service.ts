import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, filter, map, Observable, switchMap, take, tap } from 'rxjs';
import { Khachhang } from './khachhang.type';
@Injectable({
  providedIn: 'root'
})
export class KhachhangsService {
  private _datastaza: BehaviorSubject<any> = new BehaviorSubject(null);
  private _datastimona: BehaviorSubject<any> = new BehaviorSubject(null);
  private _khachhangstaza: BehaviorSubject<any> = new BehaviorSubject(null);
  private _khachhangstimona: BehaviorSubject<any> = new BehaviorSubject(null);
 constructor(private _httpClient: HttpClient)
  {}
  get datastaza$(): Observable<any>
  {
      return this._datastaza.asObservable();
  }
  get datastimona$(): Observable<any>
  {
      return this._datastimona.asObservable();
  }
  get khachhangstaza$(): Observable<any>
  {
      return this._khachhangstaza.asObservable();
  }
  get khachhangstimona$(): Observable<any>
  {
      return this._khachhangstimona.asObservable();
  }
  GetAllDataTaza():  Observable<Khachhang[]>
  {
      return this._httpClient.get(`${environment.ApiURL}/khachhangs/chitiet`).pipe(
          tap((khachhang: Khachhang[]) => {             
            this._datastaza.next(khachhang);
           //console.log(khachhang);
          })
      );
  }
  GetDataTazaByChiNhanh(Chinhanh):  Observable<Khachhang[]>
  {
      return this._httpClient.get(`${environment.ApiURL}/khachhangs/chitiet/paged?Chinhanh=${Chinhanh}`).pipe(
          tap((khachhang: Khachhang[]) => {             
            this._datastaza.next(khachhang);
          // console.log(khachhang);
          })
      );
  }
  CreateDataTaza(dulieu): Observable<any>
  {
    return this.datastaza$.pipe(
        take(1),
        switchMap(datas => this._httpClient.post(`${environment.ApiURL}/khachhangs/chitiet`, dulieu).pipe(
            map((result) => {
                this._datastaza.next([result, ...datas]);
              //  console.log(result);         
                return result;
            })
        ))
    );
  }
  UpdateDataTaza(dulieu,id): Observable<any> {
    return this.datastaza$.pipe(
        take(1),
        switchMap(datas => this._httpClient.patch(`${environment.ApiURL}/khachhangs/chitiet/${id}`, dulieu).pipe(
            map((data) => {
                const index = datas.findIndex(item => item.id === id);
                datas[index] = data;
                this._datastaza.next(datas);
                return data;
            }),
            switchMap(data => this.datastaza$.pipe(
                take(1),
                filter(item => item && item.id === id),
                tap(() => {
                    this._datastaza.next(data);
                    return data;
                })
            ))
        ))
    );
}
// DeleteDataTaza(id): Observable<any> {
//     return this.datastaza$.pipe(
//         take(1),
//         switchMap(datas => this._httpClient.delete(`${environment.ApiURL}/khachhangs/chitiet/${id}`).pipe(
//             map((isDeleted: boolean) => {
//                 const index = datas.findIndex(item => item.id === id);
//                 datas.splice(index, 1);
//                 this._datastaza.next(datas);
//                 return isDeleted;
//             })
//         ))
//     );
//   }
DeleteDataTaza(id): Observable<any> {
    return this._httpClient.delete(`${environment.ApiURL}/khachhangs/chitiet/${id}`).pipe(
      tap(() => {
          
      })
  );
  } 

 GetAllDataTimona():  Observable<Khachhang[]>
  {
      return this._httpClient.get(`${environment.ApiURL}/khtimona/khtimonachitiet`).pipe(
          tap((khachhang: Khachhang[]) => {             
            this._datastimona.next(khachhang);
           //console.log(khachhang);
          })
      );
  }
  GetDataTimonaByChiNhanh(Chinhanh):  Observable<any>
  {
      console.log();
      
      return this._httpClient.get(`${environment.ApiURL}/khtimona/khtimonachitiet/paged?Chinhanh=${Chinhanh}`).pipe(
          tap((khachhang) => {    
            console.log(khachhang);         
            this._datastimona.next(khachhang);
          })
      );
  }
  CreateDataTimona(dulieu): Observable<any>
  {
    return this.datastimona$.pipe(
        take(1),
        switchMap(datas => this._httpClient.post(`${environment.ApiURL}/khtimona/khtimonachitiet`, dulieu).pipe(
            map((result) => {
                this._datastimona.next([result, ...datas]);
              //  console.log(result);         
                return result;
            })
        ))
    );
  }
  UpdateDataTimona(dulieu,id): Observable<any> {
    return this.datastimona$.pipe(
        take(1),
        switchMap(datas => this._httpClient.patch(`${environment.ApiURL}/khtimona/khtimonachitiet/${id}`, dulieu).pipe(
            map((data) => {
                const index = datas.findIndex(item => item.id === id);
                datas[index] = data;
                this._datastimona.next(datas);
                return data;
            }),
            switchMap(data => this.datastimona$.pipe(
                take(1),
                filter(item => item && item.id === id),
                tap(() => {
                    this._datastimona.next(data);
                    return data;
                })
            ))
        ))
    );
}

// DeleteDataTimona(id): Observable<any> {
//     return this.datastimona$.pipe(
//         take(1),
//         switchMap(datas => this._httpClient.delete(`${environment.ApiURL}/khtimona/khtimonachitiet/${id}`).pipe(
//             map((isDeleted: boolean) => {
//                 const index = datas.findIndex(item => item.id === id);
//                 datas.splice(index, 1);
//                 this._datastimona.next(datas);
//                 return isDeleted;
//             })
//         ))
//     );
//   }
  DeleteDataTimona(id): Observable<any> {
      return this._httpClient.delete(`${environment.ApiURL}/khtimona/khtimonachitiet/${id}`).pipe(
        tap(() => {
            
        })
    );
    }  
}
