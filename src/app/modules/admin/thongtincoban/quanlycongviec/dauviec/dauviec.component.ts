import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { UserService } from 'app/core/user/user.service';
import { NhanvienService } from 'app/modules/admin/baocao/nhanvien/nhanvien.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { QuanlycongviecService } from '../quanlycongviec.service';
@Component({
  selector: 'app-dauviec',
  templateUrl: './dauviec.component.html',
  styleUrls: ['./dauviec.component.scss'],
  encapsulation:ViewEncapsulation.None,
})
export class DauviecComponent implements OnInit {
  displayedColumns: string[] = ['No','tieude','deadline','uutien','duan','section','comment'];
  Grouptasks: any[] = [];
  Tasks: any[] = [];
  filteredGrouptasks: any;
  filteredTasks: any;
  filteredDuans: any;
  CUser: any;
  Uutiens:any[];
  Duans:any[];
  triggerOrigin :any;
  isOpenDuan = false;
  SelectDuan:any;
  TasksNoGroup:any;
  @ViewChild('titleInput') titleInput: ElementRef;
  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private _quanlycongviecService: QuanlycongviecService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _notifierService: NotifierService,
    private _userService: UserService,
    private _nhanvienServiceService: NhanvienService,
  ) {}

  ngOnInit(): void {
    this._userService.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data) => {
      this.CUser = data;
      this._changeDetectorRef.markForCheck();         
    });  

    this._quanlycongviecService.grouptasks$.subscribe((data) => {
      this.Grouptasks = this.filteredTasks = data.filter(v=>v.idTao == this.CUser.id);
      console.log(data.filter(v=>v.idTao == this.CUser.id));
      this._changeDetectorRef.markForCheck();
    })

    this._quanlycongviecService.tasks$.subscribe((data) => {
      this.Tasks = this.filteredTasks = data.filter(v=>v.idTao == this.CUser.id);
      this._changeDetectorRef.markForCheck();
    })
    
    this._quanlycongviecService.duans$.subscribe((data) => {
      this.Duans = this.filteredDuans = data.filter(v=>v.idTao == this.CUser.id||v.Thamgia.some(v1=>v1==this.CUser.id));
      this._changeDetectorRef.markForCheck();
    })
    const Grouptask = this.Grouptasks.map(v => v.id);
    console.log(Grouptask);
    console.log(this.Grouptasks);
    this.TasksNoGroup =  this.Tasks.filter(v=> !Grouptask.includes(v.sid))
  }
  toggleDuan(trigger: any,row) {
    this.SelectDuan = row
    this.triggerOrigin = trigger;
    this.isOpenDuan = !this.isOpenDuan
  }
  ChonDuan(item,id) {
    item.pjid = id;
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    this.isOpenDuan =false;
  }
  GetdataSource(item) {
    return this.Tasks.filter(v => v.sid == item.id);
  }
  CreateGrouptasks() {
    let section = { Tieude: "New Group", IsOpen: true, idTao: this.CUser.id}
    if (this.Grouptasks.length != 0 && this.Grouptasks[0].Tieude == "New Group") {
      this._notifierService.notify('error', 'Có Group Mới Chưa Đổi Tên');
    }
    else {
      this._quanlycongviecService.CreateGrouptasks(section).subscribe();
    }
  }
  CreateTaks(idSection) {
    const task = { Tieude: "New Task", sid: idSection, idTao: this.CUser.id }
    const checktask = this.Tasks.filter(v => v.sid == idSection);
    if (checktask.length != 0 && checktask[0].Tieude == "New Task") {
      this._notifierService.notify('error', 'Có Task Mới Chưa Đổi Tên');
    }
    else {
      this._quanlycongviecService.CreateTasks(task).subscribe();
    }
  }
  UpdateTask(item, type, value) {    
    item[type] = value;
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    console.log(item);
  }
  DeleteGrouptasks(item) {
    this._quanlycongviecService.DeleteGrouptasks(item.id).subscribe();
  }
  EditGrouptasks(event, item) {
    item.Tieude = event.target.value;
    this._quanlycongviecService.UpdateGrouptasks(item, item.id).subscribe();
  }
  EditTasks(event, item) {
    item.Tieude = event.target.value;
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    console.log(event.target.value);
    console.log(item);
  }
  ChangeStatusTasks(item, status) {
    item.Trangthai = status;
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    this.ngOnInit();
  }
  UpdateDeadline(item,value) {
    item.Deadline = value;
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    this.ngOnInit();
  }
  UpdateUutien(item,value) {
    item.Uutien = value;
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    this.ngOnInit();
  }
  toggleGrouptasks(item) {
    item.IsOpen = !item.IsOpen;
    this._quanlycongviecService.UpdateGrouptasks(item, item.id).subscribe();
  }

}
