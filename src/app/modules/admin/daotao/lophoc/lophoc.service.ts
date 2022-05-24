import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LophocService {

  private urlApi = 'http://localhost:3000/lophoc';
  private _lophoc: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _file: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private http: HttpClient) {}

  get lophoc$(): Observable<any[]> {
      return this._lophoc.asObservable();
  }
  
  get file$(): Observable<any> {
      return this._file.asObservable();
  }

  getLophoc() {
      return this.http.get<any>(this.urlApi).pipe(
          tap((lophoc) => {

              this._lophoc.next(lophoc);
          })
      );
  }
  addLophoc(data) {
      return this.lophoc$.pipe(
          take(1),
          switchMap((arr) =>
              this.http.post(this.urlApi, data).pipe(
                  map((lophoc:any) => {
                      this._lophoc.next([lophoc, ...arr]);
                      return lophoc;
                  })
              )
          )
      );
  }

  updateFile(id, data) {
      return this.lophoc$.pipe(
          take(1),
          switchMap((lophoc) =>
              this.http.patch(this.urlApi + `/${id}`, data).pipe(
                  map((updateCourse) => {
                      // Find the index of the updated tag
                      const index = lophoc.findIndex(
                          (item) => item.id === item.id
                      );

                      // Update the tag
                      lophoc[index] = data;
                      console.log(updateCourse);

                      // Update the tags
                      this._lophoc.next(lophoc);

                      // Return the updated tag
                      return updateCourse;
                  })
              )
          )
      );
  }
  // getFileDetail(id){
  //     return this.http.get(this.urlApi + `/${id}`).pipe(
  //         tap((res) => {
  //             this._file.next(res)
  //             return res;
  //         })
  //     );
  // }
  // updateFileDetail(file){        
  //     return this.http.patch(this.urlApi + `/${file.id}`,file).pipe(
  //         tap((res)=>{
              
  //             this._file.next(res)
  //             return res;
  //         })
  //     )
  // }
  deleteLophoc(id){
      return this.lophoc$.pipe(
          take(1),
          switchMap(data=>this.http.delete(this.urlApi + `/${id}`).pipe(map((isDelete => {
            
           const updateFile =  data.filter(e => e.id != id);
            
            this._lophoc.next(updateFile)
            return isDelete
    
          }))))
        )
  }
}
