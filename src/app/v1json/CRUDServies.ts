getAllDanhmuc(): Observable<any> {
    return this._httpClient.get(`${environment.ApiURL}/danhmuc`).pipe(
        tap((response: any) => {
            this._danhmucs.next(response);
        })
    );
}
CreateDanhmuc(danhmuc): Observable<any> {
    return this.danhmucs$.pipe(
        take(1),
        switchMap(danhmucs => this._httpClient.post(`${environment.ApiURL}/danhmuc`, danhmuc).pipe(
            map((result) => {
                this._danhmucs.next([result, ...danhmucs]);
                return result;
            })
        ))
    );
}
UpdateDanhmuc(data): Observable<any> {
    return this.danhmucs$.pipe(
        take(1),
        switchMap(danhmucs => this._httpClient.patch(`${environment.ApiURL}/danhmuc/${data.id}`, data).pipe(
            map((danhmuc) => {
                const index = danhmucs.findIndex(item => item.id === data.id);
                danhmucs[index] = danhmuc;
                this._danhmucs.next(danhmucs);
                return danhmuc;
            }),
            switchMap(danhmuc => this.danhmuc$.pipe(
                take(1),
                filter(item => item && item.id === data.id),
                tap(() => {
                    this._danhmuc.next(danhmuc);
                    return danhmuc;
                })
            ))
        ))
    );
}
Deletedanhmuc(data): Observable<any> {
    return this._httpClient.delete(`${environment.ApiURL}/danhmuc/${data.id}`).pipe(
      tap(() => {
          this.getAllDanhmuc().subscribe();
      })
  );
}