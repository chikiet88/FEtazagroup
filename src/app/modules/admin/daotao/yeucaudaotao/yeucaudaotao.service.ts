import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class YeucaudaotaoService {

  private urlApi = 'http://localhost:3000/yeucaudaotao';
    private _yeucaudaotao: BehaviorSubject<any | null> = new BehaviorSubject(null);

    constructor(private http: HttpClient) {}

    get yeucaudaotao$(): Observable<any> {
        return this._yeucaudaotao.asObservable();
    }
    uploadYeucaudaotao(data) {
        return this.yeucaudaotao$.pipe(
            take(1),
            switchMap((res) =>
                this.http.post(this.urlApi, data).pipe(
                    map((yeucaudaotao) => {
                        console.log(data);

                        this._yeucaudaotao.next([yeucaudaotao, ...res]);

                        return yeucaudaotao;
                    })
                )
            )
        );
    }

    getYeucaudaotao() {
      return this.http.get(this.urlApi).pipe(
          tap((res) => {
              this._yeucaudaotao.next(res);
              return res;
          })
      );
  }
  updateYeucaudaotao(data){
    return this.yeucaudaotao$.pipe(
      take(1),
      switchMap((res) =>
          this.http.patch(this.urlApi+`/${data.id}`, data).pipe(
              map((yeucaudaotao) => {
                  this._yeucaudaotao.next([yeucaudaotao, ...res]);

                  return yeucaudaotao;
              })
          )
      )
  );
  }
  deleteYeucaudaotao(id) {
    return this.yeucaudaotao$.pipe(
        take(1),
        switchMap((yeucaudaotao) =>
            this.http.delete(this.urlApi + `/${id}`).pipe(
                map((isDelete) => {
                    const updateYeucaudaotao = yeucaudaotao.filter((e) => e.id != id);

                    this._yeucaudaotao.next(updateYeucaudaotao);
                    return isDelete;
                })
            )
        )
    );

   
}
}
