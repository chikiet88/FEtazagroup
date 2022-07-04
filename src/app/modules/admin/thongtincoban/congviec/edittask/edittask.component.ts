import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NotifierService } from 'angular-notifier';
import { UserService } from 'app/core/user/user.service';
import { ScrumboardService } from 'app/modules/admin/apps/scrumboard/scrumboard.service';
import { NhanvienService } from 'app/modules/admin/baocao/nhanvien/nhanvien.service';
import { CauhinhService } from 'app/modules/admin/cauhinh/cauhinh.service';
import { Cauhinh } from 'app/modules/admin/cauhinh/cauhinh.types';
import { Subject, takeUntil } from 'rxjs';
import { CongviecComponent } from '../congviec.component';
import { CongviecService } from '../congviec.service';
import Editor from 'ckeditor5/build/ckEditor';
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
  Vitri: any;
  triggerOrigin: any;
  triggerType:any[]=[];
  Nhanviens: any[];
  filteredNhanviens: any[];
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
    private _cauhinhService: CauhinhService,
  ) {
    this._userService.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data) => {
        this.CUser = data;
        this._changeDetectorRef.markForCheck();
    });
    this._cauhinhService.getCauhinhs().subscribe();
    this._cauhinhService.Cauhinhs$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: Cauhinh[]) => {
         this.Vitri = data.find(v=>v.id =="ea424658-bc53-4222-b006-44dbbf4b5e8b").detail;
        this._changeDetectorRef.markForCheck();
    });
    this._nhanvienServiceService.nhanviens$.subscribe((data) => {
      this.Nhanviens = this.filteredNhanviens = data
      this._changeDetectorRef.markForCheck();
  })
      this._congviecService.getAllDuans().subscribe();
      this._congviecService.duans$.subscribe((data) => {
          this.Duans = this.filteredDuans = data
          this._changeDetectorRef.markForCheck();
      })
      this._congviecService.duan$.subscribe((data) => {
          this.ThisDuan =  data
          this._changeDetectorRef.markForCheck();
      })
      this._congviecService.task$.subscribe((data)=>{
        this.CurrentTask = data;
        //this.GroupbyUser = this.Groups.filter(v=>v.idTao==this.CurrentTask.Thuchien);
       })
  }
  public Editor = Editor ;
  public config = {
    placeholder: 'Vui lòng nhập nội dung',
    link : {
      addTargetToExternalLinks: true
    }
  };
  ngOnInit(): void {
    if(this.CurrentTask)
    {
    this._congviecComponent.drawer1.open();
    }
  }
  CloseDraw1()
  {
    this._congviecComponent.drawer1.close();
    this._router.navigate(['./',this.ThisDuan.id], {relativeTo: this._activatedRoute});
  }
  UpdateTask(item,type,value)
  {
    // this._congviecService.UpdateTasks(this.CurretTask, this.CurretTask.id).subscribe();
    // this.matDrawer.toggle();
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
  // toggleThuchien(trigger: any,item) {
  //   this.SelectDuan = item
  //   this.triggerOrigin = trigger;
  //   this.isOpenThuchien = !this.isOpenThuchien
  // }
  toggleOverlay(trigger: any,item,type) {  
    this.triggerOrigin = trigger;
    this.triggerType[type] = !this.triggerType[type]
    //this.filteredNhanviens = this.Nhanviens;    
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
    item.Batdau = StartValue;
    item.Ketthuc = EndValue;
    this._congviecService.UpdateTasks(item, item.id).subscribe();
  }
  ChangeTask(item,type,value)
  {
    console.log(item,type,value);
    item[type] = value;
    this._congviecService.UpdateTasks(item, item.id).subscribe();
    this._notifierService.notify('success', 'Cập Nhật Thành Công')
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
