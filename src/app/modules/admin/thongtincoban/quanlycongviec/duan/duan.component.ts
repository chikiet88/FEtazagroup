import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NotifierService } from 'angular-notifier';
import { UserService } from 'app/core/user/user.service';
import { NhanvienService } from 'app/modules/admin/baocao/nhanvien/nhanvien.service';
import { CauhinhService } from 'app/modules/admin/cauhinh/cauhinh.service';
import { Cauhinh } from 'app/modules/admin/cauhinh/cauhinh.types';
import { Subject, takeUntil } from 'rxjs';
import { QuanlycongviecComponent } from '../quanlycongviec.component';
import { QuanlycongviecService } from '../quanlycongviec.service';
import { DialogComponent } from './dialog/dialog.component';
export interface DialogData {
  duan: [];
}
@Component({
  selector: 'app-duan',
  templateUrl: './duan.component.html',
  styleUrls: ['./duan.component.scss']
})
export class DuanComponent implements OnInit {
  displayedColumns: string[] = ['#','tieude','deadline','uutien','duan'];
  Sections: any = [];
  Tasks: any = [];
  filteredSections: any;
  filteredTasks: any;
  filteredDuans: any;
  CUser: any;
  Uutiens:any[]=[];
  Duans:any[]=[];
  Nhanviens:any[]=[];
  Phongban:any;
  Khoi:any;
  Congty:any;
  Bophan:any;
  Vitri:any;
  Chinhanh:any;
  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private _quanlycongviecService: QuanlycongviecService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _notifierService: NotifierService,
    private _userService: UserService,
    private _quanlycongviecComponent: QuanlycongviecComponent,
    private _fuseConfirmationService: FuseConfirmationService,
    private _cauhinhService: CauhinhService,
    private _nhanvienService: NhanvienService,
    public dialog: MatDialog
  ) { 
    this._userService.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data) => {
      this.CUser = data;
      this._changeDetectorRef.markForCheck();         
    }); 
    this._quanlycongviecService.duans$.subscribe((data) => {
      this.Duans = this.filteredDuans = data.filter(v=>v.idTao==this.CUser.id || v.Thamgia.some(v1=>v1==this.CUser.id))
      this.Duans.sort((a, b) => b.Noibat - a.Noibat);
      this._changeDetectorRef.markForCheck();
    })
    this._nhanvienService.nhanviens$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((nhanvien) => {
        this.Nhanviens = nhanvien;          
        this._changeDetectorRef.markForCheck();
      });
    this._cauhinhService.Cauhinhs$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: Cauhinh[]) => {
         this.Phongban = data.find(v=>v.id =="1eb67802-1257-4cc9-b5f6-5ebc3c3e8e4d").detail;
         this.Khoi = data.find(v=>v.id =="295ec0c7-3d76-405b-80b9-7819ea52831d").detail;
         this.Congty = data.find(v=>v.id =="bf076b63-3a2c-47e3-ab44-7f3c35944369").detail;
         this.Bophan = data.find(v=>v.id =="d0694b90-6b8b-4d67-9528-1e9c315d815a").detail;
         this.Vitri = data.find(v=>v.id =="ea424658-bc53-4222-b006-44dbbf4b5e8b").detail;
         this.Chinhanh = data.find(v=>v.id =="6e2ea777-f6e8-4738-854b-85e60655f335").detail;
        this._changeDetectorRef.markForCheck();
    });
  }

  ngOnInit(): void {
  }
  CreateDuan() {
    this.dialog.open(DialogComponent, {
      data: {
        idTao:this.CUser.id
      },
      minWidth:'50%'
    });
  }
  RemoveDuan(item) {
    const confirmation = this._fuseConfirmationService.open({
      title  : 'Xóa Dự Án',
      message: 'Bạn Có Chắc Chắn Xóa Dự Án Này',
      actions: {
          confirm: {
              label: 'Xóa'
          }
      }
  });
  confirmation.afterClosed().subscribe((result) => {
      if ( result === 'confirmed' )
      {
          this._quanlycongviecService.DeleteDuans(item.id).subscribe();
      }
  });
  }

  MenuToggle()
  {
     this._quanlycongviecComponent.matDrawerMenu.toggle();
  }
  UpdateDuan(item, type, value) {      
    item[type] = value;
    delete item.sections
    this._quanlycongviecService.UpdateDuans(item, item.id).subscribe();
  }
}