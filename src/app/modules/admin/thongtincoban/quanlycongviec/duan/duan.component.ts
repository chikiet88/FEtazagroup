import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { UserService } from 'app/core/user/user.service';
import { NhanvienService } from 'app/modules/admin/baocao/nhanvien/nhanvien.service';
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
  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private _quanlycongviecService: QuanlycongviecService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _notifierService: NotifierService,
    private _userService: UserService,
    private _nhanvienServiceService: NhanvienService,
    private _quanlycongviecComponent: QuanlycongviecComponent,
    public dialog: MatDialog
  ) { 
    this._userService.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data) => {
      this.CUser = data;
      this._changeDetectorRef.markForCheck();         
    }); 
    this._quanlycongviecService.duans$.subscribe((data) => {
      this.Duans = this.filteredDuans = data.filter(v=>v.idTao==this.CUser.id ||v.Thamgia==this.CUser.id)
      console.log(data);
      this._changeDetectorRef.markForCheck();
    })
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
  MenuToggle()
  {
     this._quanlycongviecComponent.matDrawerMenu.toggle();
  }
}