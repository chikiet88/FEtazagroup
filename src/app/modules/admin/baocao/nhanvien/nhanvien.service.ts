import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { environment } from 'environments/environment';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Profile } from '../../apps/chat/chat.types';
import { Nhanvien } from './nhanvien.type';

@Injectable({
  providedIn: 'root'
})
export class NhanvienService {
  private _nhanvien: BehaviorSubject<Nhanvien | null> = new BehaviorSubject(null);
  private _nhanviens: BehaviorSubject<Nhanvien[] | null> = new BehaviorSubject(null);
  private _profile: BehaviorSubject<Profile | null> = new BehaviorSubject(null);
  private _profiles: BehaviorSubject<Profile[] | null> = new BehaviorSubject(null);
  constructor(
      private _httpClient: HttpClient,
      private _notifierService: NotifierService,
    ) {}
     get profile$(): Observable<Profile>
     {
         return this._profile.asObservable();
     }
     get profiles$(): Observable<Profile[]>
     {
         return this._profiles.asObservable();
     }
     get nhanvien$(): Observable<Nhanvien>
     {
         return this._nhanvien.asObservable();
     }
     get nhanviens$(): Observable<Nhanvien[]>
     {
         return this._nhanviens.asObservable();
     }
     getNhanviens(): Observable<Nhanvien[]>
     {
         return this._httpClient.get<Nhanvien[]>(`${environment.ApiURL}/users`).pipe(
             tap((data) => {
               //  console.log(data);
                 this._nhanviens.next(data);
             })
         );
     }
     getProfile(): Observable<Profile[]>
     {
         return this._httpClient.get<Profile[]>(`${environment.ApiURL}/profile`).pipe(
             tap((data) => {
                 this._profiles.next(data);
             })
         );
     }
     createProfile(profile): Observable<any>
     {
         return this.profiles$.pipe(
             take(1),
             switchMap(profiles => this._httpClient.post<any>(`${environment.ApiURL}/profile`, profile).pipe(
                 map((result) => {
                    this._profiles.next([result, ...profiles]);
                     return result;
                 })
             ))
         );
     }
     getProfileById(id: string): Observable<any>
     {
        return this._httpClient.get<Nhanvien>(`${environment.ApiURL}/profile/user/${id}`).pipe(
            tap((profile) => {
                this._profile.next(profile);
            })
        );
     }
    //  getNhanvienById(id: string): Observable<Nhanvien>
    //  {
    //      return this._nhanviens.pipe(
    //          take(1),
    //          map((nhanviens) => {
    //              const nhanvien = nhanviens.find(item => item.id === id) || null;
    //              this._nhanvien.next(nhanvien);
    //              return nhanvien;
    //          }),
    //          switchMap((nhanvien) => {
 
    //              if ( !nhanvien )
    //              {
    //                  return throwError('Could not found contact with id of ' + id + '!');
    //              }
 
    //              return of(nhanvien);
    //          })
    //      );
    //  }
     getNhanvienById(id: string): Observable<Nhanvien>
     {
        return this._httpClient.get<Nhanvien>(`${environment.ApiURL}/users/${id}`).pipe(
            tap((nhanvien) => {
                this._nhanvien.next(nhanvien);
            })
        );
     }
     
     searchNhanviens(query: string): Observable<Nhanvien[]>
     {
         return this._httpClient.get<Nhanvien[]>('api/apps/contacts/search', {
             params: {query}
         }).pipe(
             tap((nhanviens) => {
                 this._nhanviens.next(nhanviens);
             })
         );
     }
     createNhanvien(): Observable<any>
     {
         return this.nhanviens$.pipe(
             take(1),
             switchMap(nhanviens => this._httpClient.post<any>(`${environment.ApiURL}/users`, {SDT:"0999999999",password:"12345678",name:"Mới"}).pipe(
                 map((result) => {
                   console.log(result)
                   if(result==1)
                   {
                    this._notifierService.notify('error', 'Số Điện Thoại Đã Tồn Tạo');
                   }
                   else if(result==2)
                   {
                    this._notifierService.notify('error', 'Email Đã Tồn Tại');
                   }
                   else
                   {
                   const newNhanvien = result;
                    this._nhanviens.next([newNhanvien, ...nhanviens]);
                     return newNhanvien;
                   }
                 })
             ))
         );
     }
     ImportNhanvien(users:any): Observable<any>
     {
          return this.nhanviens$.pipe(
             take(1),
             switchMap(nhanviens => this._httpClient.post<any>(`${environment.ApiURL}/users`, users).pipe(
                 map((result) => {
                   console.log(result)
                   const newNhanvien = result;
                    this._nhanviens.next([newNhanvien, ...nhanviens]);
                     return newNhanvien;
                 })
             ))
         );
     }

     updateNhanvien(id: string, nhanvien: Nhanvien): Observable<Nhanvien>
     {
         return this.nhanviens$.pipe(
             take(1),
             switchMap(nhanviens => this._httpClient.patch<Nhanvien>(`${environment.ApiURL}/users/${id}`,nhanvien).pipe(
                 map((updatedNhanvien) => {
                     console.log(updatedNhanvien);
                     const index = nhanviens.findIndex(item => item.id === id);
                     nhanviens[index] = updatedNhanvien;
                     this._nhanviens.next(nhanviens);
                     return updatedNhanvien;
                 }),
                 switchMap(updatedNhanvien => this.nhanvien$.pipe(
                     take(1),
                     filter(item => item && item.id === id),
                     tap(() => {
                         this._nhanvien.next(updatedNhanvien);
                         return updatedNhanvien;
                     })
                 ))
             ))
         );
     }
     deleteNhanvien(id: string): Observable<boolean>
     {
         return this.nhanviens$.pipe(
             take(1),
             switchMap(nhanviens => this._httpClient.delete(`${environment.ApiURL}/users/${id}`).pipe(
                 map((isDeleted: boolean) => {
                     const index = nhanviens.findIndex(item => item.id === id);
                     nhanviens.splice(index, 1);
                     this._nhanviens.next(nhanviens);
                     return isDeleted;
                 })
             ))
         );
     } 
}
