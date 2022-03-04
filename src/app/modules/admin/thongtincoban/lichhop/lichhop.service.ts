import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { environment } from 'environments/environment';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';
import { Lichhop } from './lichhop.type';

@Injectable({
  providedIn: 'root'
})
export class LichhopService {
  private _lichops: BehaviorSubject<Lichhop[] | null> = new BehaviorSubject(null);
  private _lichhop: BehaviorSubject<Lichhop | null> = new BehaviorSubject(null);
  private readonly notifier: NotifierService;
  constructor(
    private _httpClient: HttpClient,
    private _notifierService: NotifierService,
    ) {this.notifier = _notifierService;}
  get lichhops$(): Observable<Lichhop[]>
  {
      return this._lichops.asObservable();
  }
  get lichhop$(): Observable<Lichhop>
  {
      return this._lichhop.asObservable();
  }
  getLichhops(): Observable<Lichhop[]>
  {
      return this._httpClient.get<Lichhop[]>(`${environment.ApiURL}/lichhop`).pipe(
          tap((ves:Lichhop[]) => {
              this._lichops.next(ves);
          })
      );
  }
  CreateLichhop(Lichhop:Lichhop): Observable<Lichhop[]>
  {
    console.log(Lichhop);
    return this._httpClient.post<Lichhop[]>(`${environment.ApiURL}/lichhop`, Lichhop).pipe(
      tap((lichhops) => {
          this._lichops.next(lichhops);
          this.notifier.notify('success', `Tạo Mới Thành Công`);
      })
  );
  }
}
