import { HttpClient } from '@angular/common/http';
import { Identifiers } from '@angular/compiler/src/render3/r3_identifiers';
import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { environment } from 'environments/environment';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Vetuyendung } from './vetuyendung.types';

@Injectable({
  providedIn: 'root'
})
export class VetuyendungService {
  private _vetuyendungs: BehaviorSubject<Vetuyendung[] | null> = new BehaviorSubject(null);
  private _vetuyendung: BehaviorSubject<Vetuyendung | null> = new BehaviorSubject(null);
  private readonly notifier: NotifierService;
  constructor(private _httpClient: HttpClient,
    private _notifierService: NotifierService,
    ) { this.notifier = _notifierService;}

  get vetuyendungs$(): Observable<Vetuyendung[]>
  {
      return this._vetuyendungs.asObservable();
  }
  get vetuyendung$(): Observable<Vetuyendung>
  {
      return this._vetuyendung.asObservable();
  }
  getVetuyendungs(): Observable<Vetuyendung[]>
  {
      return this._httpClient.get<Vetuyendung[]>(`${environment.ApiURL}/vetuyendung`).pipe(
          tap((ves:Vetuyendung[]) => {
              this._vetuyendungs.next(ves);
          })
      );
  }
  createVetuyendung(): Observable<Vetuyendung>
  {
      return this.vetuyendungs$.pipe(
          take(1),
          switchMap(vetuyendung => this._httpClient.post<Vetuyendung>(`${environment.ApiURL}/vetuyendung`,{}).pipe(
              map((newVe) => {
                  this._vetuyendungs.next([newVe, ...vetuyendung]);
                  this.notifier.notify('success', `Tạo Mới Thành Công`);
                  return newVe;
              })
          ))
      );
  }
  updateVetuyendung(id: string, vetuyendung: Vetuyendung): Observable<Vetuyendung>
  {
      return this.vetuyendungs$.pipe(
          take(1),
          switchMap(Vetuyendungs => this._httpClient.patch<Vetuyendung>(`${environment.ApiURL}/vetuyendung/${id}`, vetuyendung
        ).pipe(
              map((updatedVetuyendung) => {
                  const index = Vetuyendungs.findIndex(item => item.id === id);
                  Vetuyendungs[index] = updatedVetuyendung;
                  this._vetuyendungs.next(Vetuyendungs);
                  return updatedVetuyendung;
              }),
              switchMap(updatedVetuyendung => this.vetuyendung$.pipe(
                  take(1),
                  filter(item => item && item.id === id),
                  tap(() => {
                      this._vetuyendung.next(updatedVetuyendung);
                      return updatedVetuyendung;
                  })
              ))
          ))
      );
  }
  deleteVetuyendung(id: string): Observable<boolean>
  {
      return this.vetuyendungs$.pipe(
          take(1),
          switchMap(vetuyendungs => this._httpClient.delete(`${environment.ApiURL}/vetuyendung/${id}`).pipe(
              map((isDeleted: boolean) => {
                 this.notifier.notify('success', `Xóa Thành Công`);
                  const index = vetuyendungs.findIndex(item => item.id === id);
                  vetuyendungs.splice(index, 1);
                  this._vetuyendungs.next(vetuyendungs);
                  return isDeleted;
              })
          ))
      );
  }
  getVeById(id: string): Observable<Vetuyendung>
  {
      return this._vetuyendungs.pipe(
          take(1),
          map((vetuyendungs) => {
              const vetuyendung = vetuyendungs.find(item => item.id === id) || null;
              this._vetuyendung.next(vetuyendung);
              return vetuyendung;
          }),
          switchMap((vetuyendung) => {
              if ( !vetuyendung )
              {
                  return throwError('Could not found vetuyendung with id of ' + id + '!');
              }
              return of(vetuyendung);
          })
      );
  }

}
