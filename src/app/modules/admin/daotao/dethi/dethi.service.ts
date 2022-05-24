import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DethiService {

  private urlApi = 'http://localhost:3000/dethi';
  private _dethi: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _file: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private http: HttpClient) {}

  get dethi$(): Observable<any[]> {
      return this._dethi.asObservable();
  }
  
  get file$(): Observable<any> {
      return this._file.asObservable();
  }

  getDethi() {
      return this.http.get<any>(this.urlApi).pipe(
          tap((dethi) => {

              this._dethi.next(dethi);
          })
      );
  }
  addDethi(data) {
      return this.dethi$.pipe(
          take(1),
          switchMap((arr) =>
              this.http.post(this.urlApi, data).pipe(
                  map((dethi:any) => {
                      this._dethi.next([dethi, ...arr]);
                      return dethi;
                  })
              )
          )
      );
  }

  updateFile(id, data) {
      return this.dethi$.pipe(
          take(1),
          switchMap((dethi) =>
              this.http.patch(this.urlApi + `/${id}`, data).pipe(
                  map((updateCourse) => {
                      // Find the index of the updated tag
                      const index = dethi.findIndex(
                          (item) => item.id === item.id
                      );

                      // Update the tag
                      dethi[index] = data;
                      console.log(updateCourse);

                      // Update the tags
                      this._dethi.next(dethi);

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
  deleteDethi(id){
      return this.dethi$.pipe(
          take(1),
          switchMap(data=>this.http.delete(this.urlApi + `/${id}`).pipe(map((isDelete => {
            
           const updateFile =  data.filter(e => e.id != id);
            
            this._dethi.next(updateFile)
            return isDelete
    
          }))))
        )
  }
}
