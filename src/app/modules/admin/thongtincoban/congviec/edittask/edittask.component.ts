import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NotifierService } from 'angular-notifier';
import { UserService } from 'app/core/user/user.service';
import { ScrumboardService } from 'app/modules/admin/apps/scrumboard/scrumboard.service';
import { NhanvienService } from 'app/modules/admin/baocao/nhanvien/nhanvien.service';
import { Subject, takeUntil } from 'rxjs';
import { CongviecComponent } from '../congviec.component';
import { CongviecService } from '../congviec.service';

@Component({
  selector: 'app-edittask',
  templateUrl: './edittask.component.html',
  styleUrls: ['./edittask.component.scss']
})
export class EdittaskComponent implements OnInit {
  CUser: any;
  ThisDuan: any;
  Duans: any[];
  filteredDuans: any[];
  Groups: any[];
  filteredGroups: any[];
  GroupbyUser:any[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  CurrentTask:any;
  constructor(
    private _scrumboardService: ScrumboardService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _congviecService: CongviecService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _notifierService: NotifierService,
    private _userService: UserService,
    private _nhanvienServiceService: NhanvienService,
    private _congviecComponent: CongviecComponent,
    private _matDialog: MatDialog,
  ) {
    this._userService.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data) => {
        this.CUser = data;
        this._changeDetectorRef.markForCheck();
    });
      this._congviecService.getAllDuans().subscribe();
      this._congviecService.duans$.subscribe((data) => {
          this.Duans = this.filteredDuans = data
          this._changeDetectorRef.markForCheck();
      })
      this._congviecService.task$.subscribe((data)=>{
        if(data)
        {
        this.CurrentTask = data;
        this.GroupbyUser = this.Groups.filter(v=>v.idTao==this.CurrentTask.Thuchien);
        console.log(data);
        }
       })

  }


  ngOnInit(): void {

    this._matDialog.open(ScrumboardCardDetailsComponent, {autoFocus: false})
    .afterClosed()
    .subscribe(() => {

        // Go up twice because card routes are setup like this; "card/CARD_ID"
        this._router.navigate(['./../..'], {relativeTo: this._activatedRoute});
    });
  }
  CloseDraw1()
  {
    this._congviecComponent.drawer1.toggle();
  }



  ChonDuan(item,id) {
    // item.sid = id;
    // this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    // this.isOpenDuan =false;
  }
  RemoveDuan(item) {
    // item.sid = "";
    // this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    // this.isOpenGroup =false;
  }
  ChonGroup(item,id) {
    // item.gid = id;
    // this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    // this.isOpenGroup =false;
  }
  toggleDuan(trigger: any,item) {
    // this.SelectDuan = item
    // this.triggerOrigin = trigger;
    // this.isOpenDuan = !this.isOpenDuan
  }
  toggleThuchien(trigger: any,item) {
    // this.SelectDuan = item
    // this.triggerOrigin = trigger;
    // this.isOpenThuchien = !this.isOpenThuchien
  }
  ChonThuchien(item,id) {
    // const notifi = {
    //   idFrom:  this.CUser.id,
    //   idTo: id,
    //   Tieude: "Quản Lý Công Việc ",
    //   Noidung: item.Tieude,
    //   Lienket: `${this._router.url}`,
    // };
    // this._NotificationsService.create(notifi).subscribe();
    // item.Thuchien = id;
    // item.gid ='';
    // this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    // this.isOpenThuchien =false;
    // this.filteredNhanvien = this.Nhanviens;
  }
  filterThanvien(event): void
  {
    // const value = event.target.value.toLowerCase();
    // this.filteredNhanvien = this.Nhanviens.filter(v => v.name.toLowerCase().includes(value));
  }
  toggleGroup(trigger: any,item) {
    // this.SelectDuan = item
    // this.triggerOrigin = trigger;
    // this.isOpenGroup = !this.isOpenGroup
  }
  UpdateDeadlineTask(item,StartValue,EndValue)
  {
    // item.Batdau = StartValue;
    // item.Ketthuc = EndValue;
    // this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
  }
  ChangeTask(item,type,value)
  {
    // console.log(item,type,value);
    // item[type] = value;
    // this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
  }

  UpdateTask()
  {
    // this._quanlycongviecService.UpdateTasks(this.CurretTask, this.CurretTask.id).subscribe();
    // this.matDrawer.toggle();
  }
  DeleteTask()
  {
    // const confirmation = this._fuseConfirmationService.open({
    //   title  : 'Xóa Đầu Việc',
    //   message: 'Bạn Có Chắc Chắn Xóa Đầu Việc Này',
    //   actions: {
    //       confirm: {
    //           label: 'Xóa'
    //       }
    //   }
  // });
  // confirmation.afterClosed().subscribe((result) => {
      // if ( result === 'confirmed' )
      // {
      //   this._quanlycongviecService.DeleteTasks(this.CurretTask.id).subscribe();
      //   this.matDrawer.toggle();
      // }
  // });
  }
}
