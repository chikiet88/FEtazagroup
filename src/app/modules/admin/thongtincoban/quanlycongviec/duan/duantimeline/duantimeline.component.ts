import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { Subject, takeUntil } from 'rxjs';
import { QuanlycongviecService } from '../../quanlycongviec.service';

@Component({
  selector: 'app-duantimeline',
  templateUrl: './duantimeline.component.html',
  styleUrls: ['./duantimeline.component.scss']
})
export class DuantimelineComponent implements OnInit {
  constructor(
    private _quanlycongviecService: QuanlycongviecService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
  ) {

  }
  Tasks: any[] = [];
  Sectiontasks: any[] = [];
  filteredTasks: any;
  CUser: any;
  boards$:any;
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
  options = {}
  ngOnInit(): void {
    this._quanlycongviecService.getDuanBoards();
    this._userService.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data) => {
      this.CUser = data;
      this._changeDetectorRef.markForCheck();         
    });  
    this.boards$ = this._quanlycongviecService.boards$;
    this._quanlycongviecService.duanboards$.subscribe((data)=>{
      console.log(data);
      //this.Sectiontasks = data = data.filter(v1=>v1.tasks.some(v=>v.idTao==this.CUser.id ||v.Thuchien==this.CUser.id));
      const Arrayobject = [];
      data.forEach(v => {
        v.tasks.forEach(v1 => {
          console.log(v1);
          if(v1.Batdau && v1.Ketthuc)
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
    const rowHeight = 41;
    var chartHeight = this.data.length * rowHeight + 50;
    this.options = {
      height: chartHeight
    }
    console.log(this.data);
    
  }
  ngAfterViewInit() {

  }


}
