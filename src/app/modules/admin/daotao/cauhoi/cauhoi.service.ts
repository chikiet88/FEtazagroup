import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CauhoiService {

  private urlApi = 'http://localhost:3000/cauhoi';
  private _cauhois: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _cauhoi: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private http: HttpClient) {}

  get cauhois$(): Observable<any[]> {
      return this._cauhois.asObservable();
  }
  
  get cauhoi$(): Observable<any> {
      return this._cauhoi.asObservable();
  }

  getCauhoi() {
      return this.http.get<any>(this.urlApi).pipe(
          tap((cauhoi) => {

              this._cauhois.next(cauhoi);
          })
      );
  }
  addCauhoi(data) {
      return this.cauhois$.pipe(
          take(1),
          switchMap((arr) =>
              this.http.post(this.urlApi, data).pipe(
                  map((cauhoi:any) => {
                      this._cauhois.next([cauhoi, ...arr]);
                      return cauhoi;
                  })
              )
          )
      );
  }

  updateFile(id, data) {
      return this.cauhois$.pipe(
          take(1),
          switchMap((cauhoi) =>
              this.http.patch(this.urlApi + `/${id}`, data).pipe(
                  map((updateCourse) => {
                      // Find the index of the updated tag
                      const index = cauhoi.findIndex(
                          (item) => item.id === item.id
                      );

                      // Update the tag
                      cauhoi[index] = data;
                      console.log(updateCourse);

                      // Update the tags
                      this._cauhois.next(cauhoi);

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
  //             this._cauhoi.next(res)
  //             return res;
  //         })
  //     );
  // }
  // updateFileDetail(file){        
  //     return this.http.patch(this.urlApi + `/${file.id}`,file).pipe(
  //         tap((res)=>{
              
  //             this._cauhoi.next(res)
  //             return res;
  //         })
  //     )
  // }
  deleteCauhoi(id){
      return this.cauhois$.pipe(
          take(1),
          switchMap(data=>this.http.delete(this.urlApi + `/${id}`).pipe(map((isDelete => {
            
           const updateFile =  data.filter(e => e.id != id);
            
            this._cauhois.next(updateFile)
            return isDelete
    
          }))))
        )
  }
}
