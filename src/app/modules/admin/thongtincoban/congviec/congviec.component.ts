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
import { CauhinhService } from '../../cauhinh/cauhinh.service';
import { Cauhinh } from '../../cauhinh/cauhinh.types';
import { CongviecService } from './congviec.service';
@Component({
  selector: 'app-congviec',
  templateUrl: './congviec.component.html',
  styleUrls: ['./congviec.component.scss']
})
export class CongviecComponent implements OnInit {
  Vitri: any;
  CUser: any;
  ThisDuan: any;
  Duans: any[];
  filteredDuans: any[];
  Groups: any[];
  filteredGroups: any[];
  Tasks: any[];
  filteredTasks: any[];
  Nhanviens: any[];
  filteredNhanviens: any[];
  GroupbyUser:any[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('drawer1', {static: true}) drawer1: MatDrawer;
  CurretTask:any;
  Menuwidth:any;
  triggerOrigin: any;
  triggerType:any[]=[];
  CBoards:any[]=[];
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
    private _cauhinhService: CauhinhService,
    private _dialog: MatDialog
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
      this._congviecService.getAllDuans().subscribe();
      this._congviecService.duans$.subscribe((data) => {
          this.Duans = this.filteredDuans = data.filter(v=>v.Thamgia.some(v1=>v1==this.CUser.id))
          this._changeDetectorRef.markForCheck();
      })
      this._congviecService.duan$.subscribe((data) => {
          this.ThisDuan = data
          this._changeDetectorRef.markForCheck();
      })

      this._congviecService.getAllGrouptasks().subscribe();
      this._congviecService.grouptasks$.subscribe((data) => {
        this.Groups = this.filteredGroups = data;
        this._changeDetectorRef.markForCheck();
      })
        this._congviecService.getAllTasks().subscribe();
        this._congviecService.tasks$.subscribe((data) => {
          this.Tasks = this.filteredTasks = data.filter(v=>v.idTao==this.CUser.id||v.Thuchien==this.CUser.id);
          this._changeDetectorRef.markForCheck();
      })
      this._nhanvienServiceService.nhanviens$.subscribe((data) => {
          this.Nhanviens = this.filteredNhanviens = data
          this._changeDetectorRef.markForCheck();
      })
  }

  ngOnInit(): void {
    this.Groups = [
      {id: '0',Tieude: 'Chưa Làm'},
      {id: '1',Tieude: 'Đang Làm'},
      {id: '2',Tieude: 'Hoàn Thành'}
    ]
    this.Groups.forEach(v => {v.tasks = this.Tasks.filter(v1=>v1.Trangthai==v.id)});
    this.CBoards = this.Groups;  
    console.log(this.Tasks);
    console.log(this.Groups);
    
      this.drawer1.openedChange.subscribe((opened) => {
        if (!opened)
        {
          this._router.navigate(['./',this.ThisDuan.id], {relativeTo: this._activatedRoute});
            this._changeDetectorRef.markForCheck();
        }
    });
  }
  filterDuan(event): void
  {
    const value = event.target.value.toLowerCase();
    this.filteredDuans = this.Duans.filter(v => v.Tieude.toLowerCase().includes(value));
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
    this.ThisDuan = { "Tieude": item.value,"idTao": this.CUser.id,"Thamgia": [this.CUser.id],"Trangthai":0 };
    this._congviecService.CreateDuans(this.ThisDuan).subscribe();
    this._dialog.closeAll();
  }
  ChosenDuan(item)
  {
    this.ThisDuan = item;
    console.log(item);
  }
  UpdateDuan(item, type, value) {          
    item[type] = value;
    this._congviecService.UpdateDuans(item, item.id).subscribe();
    this._notifierService.notify('success', 'Cập Nhật Thành Công');
  }
  DeleteDuan(item) {   
    const confirmation = this._fuseConfirmationService.open({
      title: 'Xóa Dự Án',
      message: 'Bạn Có Chắc Chắn Xóa Dự Án Này',
      actions: {
          confirm: {
              label: 'Xóa'
          }
      }
  });
  confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
          this._congviecService.DeleteDuans(item.id).subscribe();
          this._notifierService.notify('success', 'Xóa Thành Công');
      }
  });   
  }

  toggleOverlay(trigger: any,item,type) {  
    this.triggerOrigin = trigger;
    this.triggerType[type] = !this.triggerType[type]
    this.filteredNhanviens = this.Nhanviens;    
  }
  filterVitri(event): void
  {
      const value = event.target.value.toLowerCase();
      this.filteredNhanviens = this.Nhanviens.filter(v => v.name.toLowerCase().includes(value));
  }
 AddValue(item,type,value) {
    item[type].push(value);
    this._congviecService.UpdateDuans(item,item.id).subscribe();
    this._changeDetectorRef.markForCheck();
    this.triggerType[type] = false;
}
RemoveValue(item,type,value) {
  const confirmation = this._fuseConfirmationService.open({
    title: 'Xóa Dự Án',
    message: 'Bạn Có Chắc Chắn Xóa',
    actions: {
        confirm: {
            label: 'Xóa'
        }
    }
});
confirmation.afterClosed().subscribe((result) => {
    if (result === 'confirmed') {
      item[type] = item[type].filter(v=>v!=value);
      this._congviecService.UpdateDuans(item,item.id).subscribe();
      this._changeDetectorRef.markForCheck();
      this.triggerType[type] = false;
        this._notifierService.notify('success', 'Xóa Thành Công');
    }
}); 
}
AllThamgia()
{
  this.Nhanviens.forEach(v => {
    this.ThisDuan.Thamgia.push(v.id);
  });
  this._congviecService.UpdateDuans(this.ThisDuan,this.ThisDuan.id).subscribe();
  this.triggerType['Thamgia'] = false;
  this._changeDetectorRef.markForCheck();
}
ClearThamgia()
{
  this.ThisDuan.Thamgia = [this.CUser.id];
  this._congviecService.UpdateDuans(this.ThisDuan,this.ThisDuan.id).subscribe();
  this.triggerType['Thamgia'] = false;
  this._changeDetectorRef.markForCheck();
}

  ngOnDestroy(): void
  {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

  
}
