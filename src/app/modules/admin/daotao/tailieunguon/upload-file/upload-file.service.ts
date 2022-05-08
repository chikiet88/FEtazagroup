import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UploadFileService {
    private urlApi = 'http://localhost:3000/files';
    private _files: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _file: BehaviorSubject<any | null> = new BehaviorSubject(null);

    constructor(private http: HttpClient) {}

    get files$(): Observable<any> {
        return this._files.asObservable();
    }
    get file$(): Observable<[]> {
        return this._file.asObservable();
    }

    uploadfile(data) {
        return this.files$.pipe(
            take(1),
            switchMap((res) =>
                this.http.post(this.urlApi, { ...data }).pipe(
                    map((files) => {
                        console.log(data);

                        this._files.next([files, ...res]);

                        return files;
                    })
                )
            )
        );
    }
    getFile() {
        return this.http.get(this.urlApi).pipe(
            tap((res) => {
                this._files.next(res);
                return res;
            })
        );
    }
    deleteFile(id) {
        return this.files$.pipe(
            take(1),
            switchMap((files) =>
                this.http.delete(this.urlApi + `/${id}`).pipe(
                    map((isDelete) => {
                        const updateFiles = files.filter((e) => e.id != id);

                        this._files.next(updateFiles);
                        return isDelete;
                    })
                )
            )
        );

       
    }
}
