import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
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
      tap((response) => {
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
  // getPath(path) {  
  //   return this._httpClient.get(`${environment.ApiURL}/upload/path/${path}`).pipe(
  //     tap((response: any) => {
  //       console.log(response);
        
  //           return response;
  //     })
  //   );
  // }
  deletePath(path) {  
    return this._httpClient.delete(`${environment.ApiURL}/upload/path/${path}`).pipe(
      tap((response: any) => {
          console.log(response);
            return response;
      })
    );
  }

  UploadFile(formData,User,UUid)
  {
    this._httpClient.post(`${environment.ApiURL}/upload/file`, formData, { reportProgress: true, observe: 'events' })
    .subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        console.log(Math.round(100 * event.loaded / event.total));
      } else if (event instanceof HttpResponse) {
        
        const upload = { idTao:User.id,uuid: UUid, Tieude: event.body['originalname'], Lienket: event.body['filename'], Exten:event.body['originalname'].split('.').pop()};
        this.CreateUpload(upload).subscribe((data)=>
         {return data}
        );
      }
    })
  }
  CreateUpload(upload): Observable<any> {
    return this.uploads$.pipe(
      take(1),
      switchMap(uploads => this._httpClient.post(`${environment.ApiURL}/upload`, upload).pipe(
        map((result) => {
          console.log(result);        
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
  DeleteUpload(id): Observable<any> {
    return this.uploads$.pipe(
      take(1),
      switchMap(uploads => this._httpClient.delete(`${environment.ApiURL}/upload/${id}`).pipe(
        map((isDeleted: boolean) => {
          const index = uploads.findIndex(item => item.id === id);
          uploads.splice(index, 1);
          this._uploads.next(uploads);
          console.log(isDeleted);
          console.log(this._uploads);
          return isDeleted;
        })
      ))
    );
  }
}
