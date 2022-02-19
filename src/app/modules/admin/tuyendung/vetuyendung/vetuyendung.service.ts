import { HttpClient } from '@angular/common/http';
import { Identifiers } from '@angular/compiler/src/render3/r3_identifiers';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Vetuyendung } from './vetuyendung.types';

@Injectable({
  providedIn: 'root'
})
export class VetuyendungService {
  private _vetuyendungs: BehaviorSubject<Vetuyendung[] | null> = new BehaviorSubject(null);
  private _vetuyendung: BehaviorSubject<Vetuyendung | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient) { }

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
                  return newVe;
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
