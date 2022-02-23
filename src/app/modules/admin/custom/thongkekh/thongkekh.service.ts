import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThongkekhService {
  private _data: BehaviorSubject<any> = new BehaviorSubject(null);
 constructor(private _httpClient: HttpClient)
  {
    
  }
  get data$(): Observable<any>
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
}