import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CongviecService {
  private _duans: BehaviorSubject<any> = new BehaviorSubject(null);
  private _duan: BehaviorSubject<any> = new BehaviorSubject(null);
  private _comments: BehaviorSubject<any> = new BehaviorSubject(null);
  private _comment: BehaviorSubject<any> = new BehaviorSubject(null);
  private _grouptasks: BehaviorSubject<any> = new BehaviorSubject(null);
  private _grouptask: BehaviorSubject<any> = new BehaviorSubject(null);
  private _tasks: BehaviorSubject<any> = new BehaviorSubject(null);
  private _task: BehaviorSubject<any> = new BehaviorSubject(null);
  private _boards: BehaviorSubject<any> = new BehaviorSubject(null);
  private _showchart: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(private _httpClient: HttpClient) {
  }
get comments$(): Observable<any> {
    return this._comments.asObservable();
  }
get comment$(): Observable<any> {
    return this._comment.asObservable();
  }
get duans$(): Observable<any> {
    return this._duans.asObservable();
  }
get duan$(): Observable<any> {
    return this._duan.asObservable();
  }
  get grouptasks$(): Observable<any> {
    return this._grouptasks.asObservable();
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
get boards$(): Observable<any> {
  return this._boards.asObservable();
}
changeTask(task)
{
    this._task.next(task);
}
setTask(tasks)
{
  this._tasks.next(tasks);
}
get Showchart$(): Observable<any> {
  return this._showchart.asObservable();
}
setShowchart(value)
{
  this._showchart.next(value);
}

getBoards() {
  const duan = this._duan.value;
  if(duan)
  {
  const grouptasks = this._grouptasks.value.filter(v1=>v1.pid==duan.id);
  const tasks = this._tasks.value;
  grouptasks.forEach(v => {v.tasks = tasks.filter(v1=>v1.gid==v.id)});
  grouptasks.sort((a, b) => a.Ordering - b.Ordering);
 // console.log(grouptasks);
  return this._boards.next(grouptasks);
  }
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
       // console.log(response); 
        this._duan.next(response);
        this.getBoards();
      })
    );
  }
  getDuanByuser(id): Observable<any> {
    return this._httpClient.get(`${environment.ApiURL}/project/user/${id}`).pipe(
      tap((response: any) => {
        this._duans.next(response);
        this.getBoards();
      })
    );
  }
  CreateDuans(duan): Observable<any> {
    return this.duans$.pipe(
      take(1),
      switchMap(duans => this._httpClient.post(`${environment.ApiURL}/project`, duan).pipe(
        map((result) => {
          this._duans.next([result, ...duans]);
          this._duan.next(result);
          this.getBoards();
          return result;
        })
      ))
    );
  }
  UpdateDuans(duan, id): Observable<any> {
    return this.duans$.pipe(
      take(1),
      switchMap(duans => this._httpClient.patch(`${environment.ApiURL}/project/${id}`, duan).pipe(
        map((duan) => {
          const index = duans.findIndex(item => item.id === id);
          duans[index] = duan;
          this._duans.next(duans);
          this.getBoards();
          return duan;
        }),
        switchMap(duan => this.duan$.pipe(
          take(1),
          filter(item => item && item.id === id),
          tap(() => {
            this._duan.next(duan);
            this.getBoards();
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
          this.getBoards();
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
            //console.log(response);
            this.getBoards();
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
getTasksByid(id): Observable<any> {
    return this._httpClient.get(`${environment.ApiURL}/tasks/${id}`).pipe(
        tap((response: any) => {
            this._task.next(response);
            this.getBoards();
        })
    );
}
getTasksByuser(id): Observable<any> {
    return this._httpClient.get(`${environment.ApiURL}/tasks/user/${id}`).pipe(
        tap((response: any) => {
            this._tasks.next(response);
            this.getBoards();
        })
    );
}
CreateTasks(task): Observable<any> {
    return this.tasks$.pipe(
        take(1),
        switchMap(tasks => this._httpClient.post(`${environment.ApiURL}/tasks`, task).pipe(
            map((result) => {
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
                    this.getBoards();
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

  getAllcomments(): Observable<any> {
    return this._httpClient.get(`${environment.ApiURL}/comment`).pipe(
      tap((response: any) => {       
        this._comments.next(response);
      })
    );
  }
  getcommentById(id): Observable<any> {
    return this._httpClient.get(`${environment.ApiURL}/comment/${id}`).pipe(
      tap((response: any) => {
        console.log(response); 
        this._comment.next(response);
        this.getBoards();
      })
    );
  }
  getcommentByuser(id): Observable<any> {
    return this._httpClient.get(`${environment.ApiURL}/comment/user/${id}`).pipe(
      tap((response: any) => {
        this._comments.next(response);
        this.getBoards();
      })
    );
  }
  Createcomments(comment): Observable<any> {
    return this.comments$.pipe(
      take(1),
      switchMap(comments => this._httpClient.post(`${environment.ApiURL}/comment`, comment).pipe(
        map((result) => {
          this._comments.next([result, ...comments]);
          this._comment.next(result);
          return result;
        })
      ))
    );
  }
  Updatecomments(comment, id): Observable<any> {
    return this.comments$.pipe(
      take(1),
      switchMap(comments => this._httpClient.patch(`${environment.ApiURL}/comment/${id}`, comment).pipe(
        map((comment) => {
          const index = comments.findIndex(item => item.id === id);
          comments[index] = comment;
          this._comments.next(comments);
          this.getBoards();
          return comment;
        }),
        switchMap(comment => this.comment$.pipe(
          take(1),
          filter(item => item && item.id === id),
          tap(() => {
            this._comment.next(comment);
            this.getBoards();
            return comment;
          })
        ))
      ))
    );
  }
  Deletecomments(id): Observable<any> {
    return this.comments$.pipe(
      take(1),
      switchMap(comments => this._httpClient.delete(`${environment.ApiURL}/comment/${id}`).pipe(
        map((isDeleted: boolean) => {
          const index = comments.findIndex(item => item.id === id);
          comments.splice(index, 1);
          this._comments.next(comments);
          this.getBoards();
          return isDeleted;
        })
      ))
    );
  }
}
