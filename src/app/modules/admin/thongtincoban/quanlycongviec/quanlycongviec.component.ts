import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { QuanlycongviecService } from './quanlycongviec.service';
import Editor from 'ckeditor5/build/ckEditor';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
@Component({
  selector: 'app-quanlycongviec',
  templateUrl: './quanlycongviec.component.html',
  styleUrls: ['./quanlycongviec.component.scss']
})
export class QuanlycongviecComponent implements OnInit {
  public Editor = Editor;
  public config = {
    placeholder: 'Vui lòng nhập nội dung',
    height:'100px'
  };

  @ViewChild('matDrawer', {static: false}) matDrawer: MatDrawer;
  @ViewChild('matDrawerMenu', {static: false}) matDrawerMenu: MatDrawer;
  MenuCongviec: any[] = [
    {title:'Tổng Quan',link:'tongquan'},
    {title:'Dự Án',link:'duan'},
    {title:'Đầu Việc',link:'dauviec'},
    {title:'Mục Tiêu',link:'muctieu'}
  ];
  CurretTask:any;
  SelectDuan:any;
  isOpenDuan = false;
  filteredDuans: any[];
  filteredSections: any[];
  CUser: any;
  Uutiens:any[];
  Duans:any[];
  Sections:any[];
  triggerOrigin :any;
  Duansections :any;
  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private _quanlycongviecService: QuanlycongviecService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
    ) { 
      this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.CUser = data;
        this._changeDetectorRef.markForCheck();         
      });
    }

   ngOnInit(): void {
   this._quanlycongviecService.getDuans();
   this._quanlycongviecService.getBoards();
     this._quanlycongviecService.duans$.subscribe((data) => {
      this.Duans = this.filteredDuans = data.filter(v=>v.idTao==this.CUser.id ||v.Thamgia==this.CUser.id)
      this._changeDetectorRef.markForCheck();
    })
     this._quanlycongviecService.sections$.subscribe((data) => {
      this.Sections = data;
      this._changeDetectorRef.markForCheck();
    })
    this._quanlycongviecService.task$.subscribe((data)=>{this.CurretTask = data})
    this._quanlycongviecService.Duansections$.subscribe((data)=>{this.Duansections = data;
            
    })
  } 
  ChonDuan(item,id) {
    item.sid = id;
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    this.isOpenDuan =false;
  }
  toggleDuan(trigger: any,row) {
    this.SelectDuan = row
    this.triggerOrigin = trigger;
    this.isOpenDuan = !this.isOpenDuan
  }
  UpdateDeadlineTask(item,StartValue,EndValue)
  {
    item.Batdau = StartValue;
    item.Ketthuc = EndValue;
    this.CurretTask = item;
  }
  ChangeTask(item,type,value)
  {
    console.log(item,type,value);
    
    item[type] = value;
    this.CurretTask = item;
  }

  UpdateTask()
  {
    this._quanlycongviecService.UpdateTasks(this.CurretTask, this.CurretTask.id).subscribe();
    this.matDrawer.toggle();
  }
  DeleteTask()
  {
    this._quanlycongviecService.DeleteTasks(this.CurretTask.id).subscribe();
    this.matDrawer.toggle();
  }
  UpdateEditor(item, type,{editor}: ChangeEvent ) {   
    item[type] = editor.getData();
    this.CurretTask = item;
    console.log(item);
  }

}
