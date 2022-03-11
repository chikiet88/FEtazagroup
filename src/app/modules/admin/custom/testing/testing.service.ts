import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Character, Khachhang } from '../thongkekh/character.model';

@Injectable({
  providedIn: 'root'
})
export class TestingService {

  private _data: BehaviorSubject<any> = new BehaviorSubject(null);
  private _notification: BehaviorSubject<any> = new BehaviorSubject(null);
 constructor(private _httpClient: HttpClient)
  {
    
  }
  get data$(): Observable<any>
  {
      return this._data.asObservable();
  }
  get Notification$(): Observable<any>
  {
      return this._data.asObservable();
  }
  CreateNoti(dulieu): Observable<any>
  {
    console.log(dulieu);
      return this._httpClient.post(`${environment.ApiURL}/notification`,dulieu).pipe(
          tap((response: any) => {
            this._notification.next(response);
              console.log(response)
          })
      );
  }
  GetData():  Observable<Character[]>
  {
      return this._httpClient.get(`${environment.ApiURL}/notification`).pipe(
          tap((Character: Character[]) => {
            this._data.next(Character);
           // console.log(Character);
          })
      );
   }


}
