import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NotifierService } from 'angular-notifier';
import { UserService } from 'app/core/user/user.service';
import { Subject,takeUntil } from 'rxjs';
import { ScrumboardService } from '../../apps/scrumboard/scrumboard.service';
import { NhanvienService } from '../../baocao/nhanvien/nhanvien.service';
import { CongviecService } from './congviec.service';
@Component({
  selector: 'app-congviec',
  templateUrl: './congviec.component.html',
  styleUrls: ['./congviec.component.scss']
})
export class CongviecComponent implements OnInit {
  CUser: any;
  ThisDuan: any;
  Duans: any[];
  filteredDuans: any[];
  Groups: any[];
  filteredGroups: any[];
  GroupbyUser:any[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('drawer1', {static: true}) drawer1: MatDrawer;
  CurretTask:any;
  Menuwidth:any;
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
    private _dialog: MatDialog
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
      this._congviecService.duan$.subscribe((data) => {
          this.ThisDuan = data
          this._changeDetectorRef.markForCheck();
      })
  }

  ngOnInit(): void {
      this.drawer1.openedChange.subscribe((opened) => {
        if (!opened)
        {
          this._router.navigate(['./',this.ThisDuan.id], {relativeTo: this._activatedRoute});
            this._changeDetectorRef.markForCheck();
        }
    });
  }
  Menutoggle()
  {
    this.Menuwidth = !this.Menuwidth;
  }
  OpenDialog(myDialog: TemplateRef<any>)
  {
    this._dialog.open(myDialog,{autoFocus: false});
  }
  CreateDuan(item)
  {
    console.log(item.value);
    this.ThisDuan = { "Tieude": item.value,"idTao": this.CUser.id };
    this._congviecService.CreateDuans(this.ThisDuan).subscribe();
    this._dialog.closeAll();
  }
  ChosenDuan(item)
  {
    this.ThisDuan = item;
    console.log(item);
  }
  ngOnDestroy(): void
  {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }
  
}
