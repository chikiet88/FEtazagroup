import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { QuanlycongviecService } from './quanlycongviec.service';
import Editor from 'ckeditor5/build/ckEditor';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { NhanvienService } from '../../baocao/nhanvien/nhanvien.service';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { Router } from '@angular/router';
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
  isOpenThuchien = false;
  isOpenGroup = false;
  filteredDuans: any[];
  filteredSections: any[];
  Nhanvien: any[];
  filteredNhanvien: any[];
  CUser: any;
  Uutiens:any[];
  Duans:any[];
  Groups:any[];
  GroupbyUser:any[];
  Sections:any[];
  triggerOrigin :any;
  Duansections :any;
  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private _quanlycongviecService: QuanlycongviecService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
    private _NhanvienService: NhanvienService,
    private _NotificationsService: NotificationsService,
    private _router:Router,
    ) { 
      this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.CUser = data;
        this._changeDetectorRef.markForCheck();         
      });
      this._NhanvienService.nhanviens$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((nhanvien) => {
        console.log(nhanvien);
        this.Nhanvien = nhanvien;          
        this.filteredNhanvien = nhanvien; 
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
    this._quanlycongviecService.Duansections$.subscribe((data)=>{this.Duansections = data;})
    this._quanlycongviecService.grouptasks$.subscribe((data)=>{this.Groups = data})
    this._quanlycongviecService.task$.subscribe((data)=>{
      if(data)
      {
      this.CurretTask = data;
      this.GroupbyUser = this.Groups.filter(v=>v.idTao==this.CurretTask.Thuchien);
      console.log(data);
      }
     })
  } 
  ChonDuan(item,id) {
    item.sid = id;
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    this.isOpenDuan =false;
  }
  ChonGroup(item,id) {
    item.gid = id;
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    this.isOpenGroup =false;
  }
  toggleDuan(trigger: any,item) {
    this.SelectDuan = item
    this.triggerOrigin = trigger;
    this.isOpenDuan = !this.isOpenDuan
  }
  toggleThuchien(trigger: any,item) {
    this.SelectDuan = item
    this.triggerOrigin = trigger;
    this.isOpenThuchien = !this.isOpenThuchien
  }
  ChonThuchien(item,id) {
    const notifi = {
      idFrom:  this.CUser.id,
      idTo: id,
      Tieude: "Quản Lý Công Việc ",
      Noidung: item.Tieude,
      Lienket: `${this._router.url}`,
    };
    this._NotificationsService.create(notifi).subscribe();
    item.Thuchien = id;
    item.gid ='';
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    this.isOpenThuchien =false;
    this.filteredNhanvien = this.Nhanvien;
  }
  filterThanvien(event): void
  {
    const value = event.target.value.toLowerCase();
    this.filteredNhanvien = this.Nhanvien.filter(v => v.name.toLowerCase().includes(value));
  }
  toggleGroup(trigger: any,item) {
    this.SelectDuan = item
    this.triggerOrigin = trigger;
    this.isOpenGroup = !this.isOpenGroup
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
