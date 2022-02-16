import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Vetuyendung, Vitri } from './vetuyendung';

@Injectable({
  providedIn: 'root'
})
export class VetuyendungService {
  private _vetuyendungs: BehaviorSubject<Vetuyendung[] | null> = new BehaviorSubject(null);
  private _vitris: BehaviorSubject<Vitri[] | null> = new BehaviorSubject(null);
  private _vetuyendung: BehaviorSubject<Vetuyendung | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient) { }

  get vetuyendungs$(): Observable<Vetuyendung[]>
  {
      return this._vetuyendungs.asObservable();
  }
  get vitris$(): Observable<Vitri[]>
  {
      return this._vitris.asObservable();
  } 
  get vetuyendung$(): Observable<Vetuyendung>
  {
      return this._vetuyendung.asObservable();
  }
  getVitris(): Observable<Vitri[]>
  {
      return this._httpClient.get<Vitri[]>(`${environment.ApiURL}api/apps/vetuyendungs/labels`).pipe(
          tap((response: Vitri[]) => {
              this._vitris.next(response);
          })
      );
  }
  addVitri(title: string): Observable<Vitri[]>
  {
      return this._httpClient.post<Vitri[]>('api/apps/vetuyendungs/labels', {title}).pipe(
          tap((labels) => {
              this._vitris.next(labels);
          })
      );
  }
  updateVitri(vitri: Vitri): Observable<Vitri[]>
  {
      return this._httpClient.patch<Vitri[]>('api/apps/vetuyendungs/labels', {vitri}).pipe(
          tap((vitris) => {
              this.getVetuyendungs().subscribe();
              this._vitris.next(vitris);
          })
      );
  }
  deleteVitri(id: string): Observable<Vitri[]>
  {
      return this._httpClient.delete<Vitri[]>('api/apps/vetuyendungs/labels', {params: {id}}).pipe(
          tap((vitris) => {
              this.getVetuyendungs().subscribe();
              this._vitris.next(vitris);
          })
      );
  }
  getVetuyendungs(): Observable<Vetuyendung[]>
  {
      return this._httpClient.get<Vetuyendung[]>('api/apps/vetuyendungs/all').pipe(
          tap((response: Vetuyendung[]) => {
              this._vetuyendungs.next(response);
          })
      );
  }
  getVetuyendungById(id: string): Observable<Vetuyendung>
  {
      return this._vetuyendungs.pipe(
          take(1),
          map((vetuyendungs) => {
              const vetuyendung = vetuyendungs.find(value => value.id === id) || null;
              this._vetuyendung.next(vetuyendung);
              return vetuyendung;
          }),
          switchMap((vetuyendung) => {

              if ( !vetuyendung )
              {
                  return throwError('Could not found the vetuyendung with id of ' + id + '!');
              }

              return of(vetuyendung);
          })
      );
  }
  addTask(vetuyendung: Vetuyendung, task: string): Observable<Vetuyendung>
  {
      return this._httpClient.post<Vetuyendung>('api/apps/vetuyendungs/tasks', {
          vetuyendung,
          task
      }).pipe(switchMap(() => this.getVetuyendungs().pipe(
          switchMap(() => this.getVetuyendungById(vetuyendung.id))
      )));
  }

  /**
   * Create vetuyendung
   *
   * @param vetuyendung
   */
  createVetuyendung(vetuyendung: Vetuyendung): Observable<Vetuyendung>
  {
      return this._httpClient.post<Vetuyendung>('api/apps/vetuyendungs', {vetuyendung}).pipe(
          switchMap(response => this.getVetuyendungs().pipe(
              switchMap(() => this.getVetuyendungById(response.id).pipe(
                  map(() => response)
              ))
          )));
  }

  updateVetuyendung(vetuyendung: Vetuyendung): Observable<Vetuyendung>
  {
      const updatedVetuyendung = cloneDeep(vetuyendung) as any;
      if ( updatedVetuyendung.vitris.length )
      {
          updatedVetuyendung.vitris = updatedVetuyendung.vitris.map(vitri => vitri.id);
      }
      return this._httpClient.patch<Vetuyendung>('api/apps/vetuyendungs', {updatedVetuyendung}).pipe(
          tap((response) => {
              this.getVetuyendungs().subscribe();
          })
      );
  }
  deleteVetuyendung(vetuyendung: Vetuyendung): Observable<boolean>
  {
      return this._httpClient.delete<boolean>('api/apps/vetuyendungs', {params: {id: vetuyendung.id}}).pipe(
          map((isDeleted: boolean) => {
              this.getVetuyendungs().subscribe();
              return isDeleted;
          })
      );
  }

}
