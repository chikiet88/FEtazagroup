import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { environment } from 'environments/environment';
import { BehaviorSubject, filter, map, Observable, switchMap, take, tap } from 'rxjs';
import { Lichhop } from './lichhop.type';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
@Injectable({
  providedIn: 'root'
})
export class LichhopService {
  private _lichops: BehaviorSubject<Lichhop[] | null> = new BehaviorSubject(null);
  private _lichhop: BehaviorSubject<Lichhop | null> = new BehaviorSubject(null);
  private _events: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private readonly notifier: NotifierService;
  constructor(
    private _httpClient: HttpClient,
    private _notifierService: NotifierService,
  ) { this.notifier = _notifierService; }

  get lichhops$(): Observable<Lichhop[]> {

    return this._lichops.asObservable();
  }
  get lichhop$(): Observable<Lichhop> {
    return this._lichhop.asObservable();  
  }
  get events$(): Observable<any> {
    return this._events.asObservable();  
  }
  getLichhops(): Observable<Lichhop[]> {
    return this._httpClient.get<Lichhop[]>(`${environment.ApiURL}/lichhop`).pipe(
      tap((lichhops: Lichhop[]) => {
        const events = [];
        lichhops.forEach(v => {
          let item1 = {id: v.id,start: new Date(v.Batdau),end: new Date(v.Ketthuc), color: colors.red,title: v.Tieude,allDay: true,draggable: true}
          let item2 = {id: v.id,start: new Date(v.Review),end: new Date(v.Review), color: colors.yellow,title: v.Tieude,allDay: true, draggable: true,}
          let item3 = {id: v.id,start: new Date(v.Hoanthanh),end: new Date(v.Hoanthanh),color: colors.green,title: v.Tieude,allDay: true,draggable: true,}
          events.push(item1);
          events.push(item2);
          events.push(item3);
        });
        this._events.next(events);
        this._lichops.next(lichhops);

      })
    );
  }
  CreateLichhop(Lichhop: Lichhop): Observable<Lichhop[]> {
    console.log(Lichhop);
    return this._httpClient.post<Lichhop[]>(`${environment.ApiURL}/lichhop`, Lichhop).pipe(
      tap((lichhops) => {
        this._lichops.next(lichhops);
      })
    );
  }
  UpdateLichhop(lichhop: Lichhop): Observable<Lichhop[]> {
    return this._httpClient.patch<Lichhop[]>(`${environment.ApiURL}/lichhop/${lichhop.id}`, lichhop).pipe(
      tap(() => {
          this.getLichhops().subscribe();
      })
  );
  }
  DeleteLichhop(lichhop: Lichhop): Observable<Lichhop[]> {
    return this._httpClient.delete<Lichhop[]>(`${environment.ApiURL}/lichhop/${lichhop.id}`).pipe(
      tap(() => {
          this.getLichhops().subscribe();
      })
  );
  }
}
