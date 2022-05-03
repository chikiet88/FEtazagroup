import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, switchMap, take, tap } from 'rxjs';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class QuanlycongviecService {
    private _sections: BehaviorSubject<any> = new BehaviorSubject(null);
    private _section: BehaviorSubject<any> = new BehaviorSubject(null);
    private _tasks: BehaviorSubject<any> = new BehaviorSubject(null);
    private _task: BehaviorSubject<any> = new BehaviorSubject(null);
    private _duans: BehaviorSubject<any> = new BehaviorSubject(null);
    private _duan: BehaviorSubject<any> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get sections$(): Observable<any> {
        return this._sections.asObservable();
    }
    get section$(): Observable<any> {
        return this._section.asObservable();
    }
    get tasks$(): Observable<any> {
        return this._tasks.asObservable();
    }
    get task$(): Observable<any> {
        return this._task.asObservable();
    }
    get duans$(): Observable<any> {
        return this._duans.asObservable();
    }
    get duan$(): Observable<any> {
        return this._duan.asObservable();
    }
    getAllSection(): Observable<any> {
        return this._httpClient.get(`${environment.ApiURL}/section`).pipe(
            tap((response: any) => {
                this._sections.next(response);
            })
        );
    }
    getSectionByType(Loai:string): Observable<any> {
        return this._httpClient.get(`${environment.ApiURL}/section/page?Loai=${Loai}`).pipe(
            tap((response) => {
                console.log(response);          
               const data = response||[]; 
                this._sections.next(data);
            })
        );
    }
    CreateSection(section): Observable<any> {
        console.log(section);
        
        return this.sections$.pipe(
            take(1),
            switchMap(sections => this._httpClient.post(`${environment.ApiURL}/section`, section).pipe(
                map((result) => {
                    console.log(sections);
                    this._sections.next([result, ...sections]);
                    return result;
                })
            ))
        );
    }
    UpdateSection(section,id): Observable<any> {
        return this.sections$.pipe(
            take(1),
            switchMap(sections => this._httpClient.patch(`${environment.ApiURL}/section/${id}`, section).pipe(
                map((section) => {
                    const index = sections.findIndex(item => item.id === id);
                    sections[index] = section;
                    this._sections.next(sections);
                    return section;
                }),
                switchMap(section => this.section$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {
                        this._section.next(section);
                        return section;
                    })
                ))
            ))
        );
    }
    DeleteSection(id): Observable<any> {
        return this.sections$.pipe(
            take(1),
            switchMap(sections => this._httpClient.delete(`${environment.ApiURL}/section/${id}`).pipe(
                map((isDeleted: boolean) => {
                    const index = sections.findIndex(item => item.id === id);
                    sections.splice(index, 1);
                    this._sections.next(sections);
                    return isDeleted;
                })
            ))
        );
      }
   getAllTasks(): Observable<any> {
        return this._httpClient.get(`${environment.ApiURL}/tasks`).pipe(
            tap((response: any) => {
                this._tasks.next(response);
            })
        );
    }
    CreateTasks(task): Observable<any> {
        return this.tasks$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.post(`${environment.ApiURL}/tasks`, task).pipe(
                map((result) => {
                    this._tasks.next([result, ...tasks]);
                    return result;
                })
            ))
        );
    }
    UpdateTasks(task,id): Observable<any> {
        return this.tasks$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.patch(`${environment.ApiURL}/tasks/${id}`, task).pipe(
                map((task) => {
                    const index = tasks.findIndex(item => item.id === id);
                    tasks[index] = task;
                    this._tasks.next(tasks);
                    return task;
                }),
                switchMap(task => this.task$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {
                        this._task.next(task);
                        return task;
                    })
                ))
            ))
        );
    }
    DeleteTasks(id): Observable<any> {
        return this.tasks$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.delete(`${environment.ApiURL}/tasks/${id}`).pipe(
                map((isDeleted: boolean) => {
                    const index = tasks.findIndex(item => item.id === id);
                    tasks.splice(index, 1);
                    this._tasks.next(tasks);
                    return isDeleted;
                })
            ))
        );
      }
    getAllDuans(): Observable<any> {
        return this._httpClient.get(`${environment.ApiURL}/project`).pipe(
            tap((response: any) => {
                this._duans.next(response);
            })
        );
    }
    getDuanById(id): Observable<any> {
        return this._httpClient.get(`${environment.ApiURL}/project/${id}`).pipe(
            tap((response: any) => {
                this._duan.next(response);
            })
        );
    }
    CreateDuans(duan): Observable<any> {
        return this.duans$.pipe(
            take(1),
            switchMap(duans => this._httpClient.post(`${environment.ApiURL}/project`, duan).pipe(
                map((result) => {
                    this._duans.next([result, ...duans]);
                    return result;
                })
            ))
        );
    }
    UpdateDuans(duan,id): Observable<any> {
        return this.duans$.pipe(
            take(1),
            switchMap(duans => this._httpClient.patch(`${environment.ApiURL}/project/${id}`, duan).pipe(
                map((duan) => {
                    const index = duans.findIndex(item => item.id === id);
                    duans[index] = duan;
                    this._duans.next(duans);
                    return duan;
                }),
                switchMap(duan => this.duan$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {
                        this._duan.next(duan);
                        return duan;
                    })
                ))
            ))
        );
    }
    DeleteDuans(id): Observable<any> {
        return this.duans$.pipe(
            take(1),
            switchMap(duans => this._httpClient.delete(`${environment.ApiURL}/project/${id}`).pipe(
                map((isDeleted: boolean) => {
                    const index = duans.findIndex(item => item.id === id);
                    duans.splice(index, 1);
                    this._duans.next(duans);
                    return isDeleted;
                })
            ))
        );
      }

}
