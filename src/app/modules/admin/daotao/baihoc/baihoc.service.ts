import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BaihocService {
    private urlApi = 'http://localhost:3000/baihoc';
    private _baihoc: BehaviorSubject<any | null> = new BehaviorSubject(null);

    constructor(private http: HttpClient) {}

    get baihoc$(): Observable<any> {
        return this._baihoc.asObservable();
    }
    uploadBaihoc(data) {
        return this.baihoc$.pipe(
            take(1),
            switchMap((res) =>
                this.http.post(this.urlApi, data).pipe(
                    map((baihoc) => {
                        console.log(data);

                        this._baihoc.next([baihoc, ...res]);

                        return baihoc;
                    })
                )
            )
        );
    }

    getBaihoc() {
      return this.http.get(this.urlApi).pipe(
          tap((res) => {
              this._baihoc.next(res);
              return res;
          })
      );
  }
  updateBaihoc(data){
    return this.baihoc$.pipe(
      take(1),
      switchMap((res) =>
          this.http.patch(this.urlApi+`/${data.id}`, data).pipe(
              map((baihoc) => {
                  this._baihoc.next([baihoc, ...res]);

                  return baihoc;
              })
          )
      )
  );
  }
  deleteBaihoc(id) {
    return this.baihoc$.pipe(
        take(1),
        switchMap((baihoc) =>
            this.http.delete(this.urlApi + `/${id}`).pipe(
                map((isDelete) => {
                    const updateBaihoc = baihoc.filter((e) => e.id != id);

                    this._baihoc.next(updateBaihoc);
                    return isDelete;
                })
            )
        )
    );

   
}
}
