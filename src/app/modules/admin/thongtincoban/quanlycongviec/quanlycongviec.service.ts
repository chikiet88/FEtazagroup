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
    private _grouptasks: BehaviorSubject<any> = new BehaviorSubject(null);
    private _grouptask: BehaviorSubject<any> = new BehaviorSubject(null);
    private _tasks: BehaviorSubject<any> = new BehaviorSubject(null);
    private _task: BehaviorSubject<any> = new BehaviorSubject(null);
    private _duans: BehaviorSubject<any> = new BehaviorSubject(null);
    private _duan: BehaviorSubject<any> = new BehaviorSubject(null);
    private _boards: BehaviorSubject<any> = new BehaviorSubject(null);
    private _duansections: BehaviorSubject<any> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get sections$(): Observable<any> {
        return this._sections.asObservable();
    }
    get section$(): Observable<any> {
        return this._section.asObservable();
    }
    get grouptasks$(): Observable<any> {
        return this._grouptasks.asObservable();
    }
    get Duansections$(): Observable<any> {
        return this._duansections.asObservable();
    }
    get boards$(): Observable<any> {
        return this._boards.asObservable();
    }
    get grouptask$(): Observable<any> {
        return this._grouptask.asObservable();
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
    changeTask(task)
    {
        this._task.next(task);
    }
    getBoards() {
        const grouptasks = this._grouptasks.value;
        const tasks = this._tasks.value;
        grouptasks.forEach(v => {v.tasks = tasks.filter(v1=>v1.gid==v.id)});
        grouptasks.sort((a, b) => a.Ordering - b.Ordering);
        console.log(grouptasks);
       return this._boards.next(grouptasks);
    }
    getDuans() {
        const duans = this._duans.value||[];
        const secstions = this._sections.value;
        duans.forEach(v => {v.sections = secstions.filter(v1=>v1.pjid==v.id)});
        console.log(duans);
       return this._duansections.next(duans);
    }

    getAllSection(): Observable<any> {
        return this._httpClient.get(`${environment.ApiURL}/section`).pipe(
            tap((response: any) => {
                this._sections.next(response);
            })
        );
    }
    getSectionByuser(id): Observable<any> {
        return this._httpClient.get(`${environment.ApiURL}/section/user/${id}`).pipe(
            tap((response: any) => {
                this._sections.next(response);
            })
        );
    }
    CreateSection(section): Observable<any> {       
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
    getAllGrouptasks(): Observable<any> {
        return this._httpClient.get(`${environment.ApiURL}/grouptask`).pipe(
            tap((response: any) => {
                this._grouptasks.next(response);
            })
        );
    }
    getGrouptasksByuser(id): Observable<any> {
        return this._httpClient.get(`${environment.ApiURL}/grouptask/user/${id}`).pipe(
            tap((response: any) => {
                console.log(response);
                this._grouptasks.next(response);
            })
        );
    }
    CreateGrouptasks(grouptask): Observable<any> {
        return this.grouptasks$.pipe(
            take(1),
            switchMap(grouptasks => this._httpClient.post(`${environment.ApiURL}/grouptask`, grouptask).pipe(
                map((result) => {
                    this._grouptasks.next([result, ...grouptasks]);
                    this.getBoards();
                    return result;
                })
            ))
        );
    }
    UpdateGrouptasks(grouptask,id): Observable<any> {
        return this.grouptasks$.pipe(
            take(1),
            switchMap(grouptasks => this._httpClient.patch(`${environment.ApiURL}/grouptask/${id}`, grouptask).pipe(
                map((grouptask) => {
                    const index = grouptasks.findIndex(item => item.id === id);
                    grouptasks[index] = grouptask;
                    this._grouptasks.next(grouptasks);
                    this.getBoards();
                    return grouptask;
                }),
                switchMap(grouptask => this.grouptask$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {
                        this._grouptask.next(grouptask);
                        return grouptask;
                    })
                ))
            ))
        );
    }
    DeleteGrouptasks(id): Observable<any> {
        return this.grouptasks$.pipe(
            take(1),
            switchMap(grouptasks => this._httpClient.delete(`${environment.ApiURL}/grouptask/${id}`).pipe(
                map((isDeleted: boolean) => {
                    const index = grouptasks.findIndex(item => item.id === id);
                    grouptasks.splice(index, 1);
                    this._grouptasks.next(grouptasks);
                    this.getBoards();
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
   getTasksByuser(id): Observable<any> {
        return this._httpClient.get(`${environment.ApiURL}/tasks/user/${id}`).pipe(
            tap((response: any) => {
                console.log(response);
                
                this._tasks.next(response);
            })
        );
    }
    CreateTasks(task): Observable<any> {
        return this.tasks$.pipe(
            take(1),
            switchMap(tasks => this._httpClient.post(`${environment.ApiURL}/tasks`, task).pipe(
                map((result) => {
                    console.log(result);
                    this._tasks.next([result, ...tasks]);
                    this.getBoards();
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
                    console.log(task);
                    const index = tasks.findIndex(item => item.id === id);
                    tasks[index] = task;
                    this._tasks.next(tasks);
                    this.getBoards();
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
                    this.getBoards();
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
    getDuanByuser(id): Observable<any> {
        return this._httpClient.get(`${environment.ApiURL}/project/user/${id}`).pipe(
            tap((response: any) => {
                console.log(response);  
                this._duans.next(response);
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
