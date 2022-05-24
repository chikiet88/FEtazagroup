import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KythiService {

  private urlApi = 'http://localhost:3000/kythi';
    private _kythi: BehaviorSubject<any | null> = new BehaviorSubject(null);

    constructor(private http: HttpClient) {}

    get kythi$(): Observable<any> {
        return this._kythi.asObservable();
    }
    uploadKythi(data) {
        return this.kythi$.pipe(
            take(1),
            switchMap((res) =>
                this.http.post(this.urlApi, data).pipe(
                    map((kythi) => {
                        console.log(data);

                        this._kythi.next([kythi, ...res]);

                        return kythi;
                    })
                )
            )
        );
    }

    getKythi() {
      return this.http.get(this.urlApi).pipe(
          tap((res) => {
              this._kythi.next(res);
              return res;
          })
      );
  }
  updateKythi(data){
    return this.kythi$.pipe(
      take(1),
      switchMap((res) =>
          this.http.patch(this.urlApi+`/${data.id}`, data).pipe(
              map((kythi) => {
                  this._kythi.next([kythi, ...res]);

                  return kythi;
              })
          )
      )
  );
  }
  deleteKythi(id) {
    return this.kythi$.pipe(
        take(1),
        switchMap((kythi) =>
            this.http.delete(this.urlApi + `/${id}`).pipe(
                map((isDelete) => {
                    const updateKythi = kythi.filter((e) => e.id != id);

                    this._kythi.next(updateKythi);
                    return isDelete;
                })
            )
        )
    );

   
}
}
