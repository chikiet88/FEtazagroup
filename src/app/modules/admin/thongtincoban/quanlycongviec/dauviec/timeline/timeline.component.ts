import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { Subject, takeUntil } from 'rxjs';
import { QuanlycongviecService } from '../../quanlycongviec.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  constructor(
    private _quanlycongviecService: QuanlycongviecService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
  ) {

  }
  Tasks: any[] = [];
  Grouptasks: any[] = [];
  filteredTasks: any;
  CUser: any;
  private _unsubscribeAll: Subject<any> = new Subject();
  title = 'Timeline';
  type = 'Timeline';
  chartColumns= [
    { type: 'string', id: 'Group' },
    { type: 'string', id: 'Task' },
    { type: 'date', id: 'Start' },
    { type: 'date', id: 'End' },
    ];
  data = [];

    options= {

    }
  ngOnInit(): void {
    this._quanlycongviecService.getDuans();
    this._userService.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data) => {
      this.CUser = data;
      this._changeDetectorRef.markForCheck();         
    });  
    this._quanlycongviecService.boards$.subscribe((data)=>{
      console.log(data);
      this.Grouptasks = data; 
      const Arrayobject = [];
      data.forEach(v => {
        v.tasks.forEach(v1 => {
          if(v1.Batdau || v1.Ketthuc)
          {
            Arrayobject.push({group:v.Tieude,task:v1.Tieude,start:new Date(v1.Batdau),end:new Date(v1.Ketthuc)}) 
          }
        });
      });
      this.data = Arrayobject.map(function(obj) {
      return Object.keys(obj).map(function(key) { 
        return obj[key];
      });
    });
    })
    console.log(this.data);
    
  }
  ngAfterViewInit() {

  }


}
