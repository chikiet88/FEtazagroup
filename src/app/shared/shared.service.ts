import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, filter, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private _uploads: BehaviorSubject<any> = new BehaviorSubject(null);
  private _upload: BehaviorSubject<any> = new BehaviorSubject(null);
  private _grouptasks: BehaviorSubject<any> = new BehaviorSubject(null);
  private _grouptask: BehaviorSubject<any> = new BehaviorSubject(null);
  private _tasks: BehaviorSubject<any> = new BehaviorSubject(null);
  private _task: BehaviorSubject<any> = new BehaviorSubject(null);
  private _duans: BehaviorSubject<any> = new BehaviorSubject(null);
  private _duan: BehaviorSubject<any> = new BehaviorSubject(null);
  private _boards: BehaviorSubject<any> = new BehaviorSubject(null);
  private _duansections: BehaviorSubject<any> = new BehaviorSubject(null);
  private _duanboards: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient) { }
  get uploads$(): Observable<any> {
    return this._uploads.asObservable();
  }
  get upload$(): Observable<any> {
    return this._upload.asObservable();
  }
  getAllUpload(): Observable<any> {
    return this._httpClient.get(`${environment.ApiURL}/upload`).pipe(
      tap((response: any) => {
        this._uploads.next(response);
      })
    );
  }
  getUploadById(id): Observable<any> {
    return this._httpClient.get(`${environment.ApiURL}/upload/${id}`).pipe(
      tap((response: any) => {
        this._upload.next(response);
      })
    );
  }
  getPath(path) {
    return this._httpClient.get(`${environment.ApiURL}/upload/path/${path}`).pipe(
      tap((response: any) => {
            return response;
      })
    );
  }
  CreateUpload(upload): Observable<any> {
    return this.upload$.pipe(
      take(1),
      switchMap(uploads => this._httpClient.post(`${environment.ApiURL}/upload`, upload).pipe(
        map((result) => {
          // console.log(sections);
          this._uploads.next([result, ...uploads]);
          return result;
        })
      ))
    );
  }
  // UpdateSection(section, id): Observable<any> {
  //   return this.sections$.pipe(
  //     take(1),
  //     switchMap(sections => this._httpClient.patch(`${environment.ApiURL}/section/${id}`, section).pipe(
  //       map((section) => {
  //         const index = sections.findIndex(item => item.id === id);
  //         sections[index] = section;
  //         this._sections.next(sections);
  //         this.getDuanBoards();
  //         return section;
  //       }),
  //       switchMap(section => this.section$.pipe(
  //         take(1),
  //         filter(item => item && item.id === id),
  //         tap(() => {
  //           this._section.next(section);
  //           return section;
  //         })
  //       ))
  //     ))
  //   );
  // }
  // DeleteSection(id): Observable<any> {
  //   return this.sections$.pipe(
  //     take(1),
  //     switchMap(sections => this._httpClient.delete(`${environment.ApiURL}/section/${id}`).pipe(
  //       map((isDeleted: boolean) => {
  //         const index = sections.findIndex(item => item.id === id);
  //         sections.splice(index, 1);
  //         this._sections.next(sections);
  //         this.getDuanBoards();
  //         return isDeleted;
  //       })
  //     ))
  //   );
  // }
}
