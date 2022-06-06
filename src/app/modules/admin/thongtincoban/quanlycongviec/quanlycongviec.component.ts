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
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Cauhinh } from '../../cauhinh/cauhinh.types';
import { CauhinhService } from '../../cauhinh/cauhinh.service';
import { MyUploadAdapter } from '../../daotao/MyUploadAdapter';
import { FileUploadService } from '../../daotao/services/file-upload.service';
import { SharedService } from 'app/shared/shared.service';
@Component({
  selector: 'app-quanlycongviec',
  templateUrl: './quanlycongviec.component.html',
  styleUrls: ['./quanlycongviec.component.scss']
})
export class QuanlycongviecComponent implements OnInit {
  public Editor = Editor;
  public onReady(editor) {
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
          return new MyUploadAdapter(loader, this._uploadService,this._sharedService);
      };
      editor.ui
          .getEditableElement()
          .parentElement.insertBefore(
              editor.ui.view.toolbar.element,
              editor.ui.getEditableElement()
          );
  }
  public config = {
       placeholder: 'Vui lòng nhập nội dung',
       height:'100px',
      htmlSupport: {
          allow: [
              {
                  name: /.*/,
                  attributes: true,
                  classes: true,
              },
          ],
      },
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
  filteredNhanvien: any[];
  CUser: any;
  Uutiens:any[];
  Duans:any[];
  Groups:any[];
  GroupbyUser:any[];
  Sections:any[];
  Nhanviens:any[]=[];
  triggerOrigin :any;
  Duansections :any;
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
    private _userService: UserService,
    private _NhanvienService: NhanvienService,
    private _NotificationsService: NotificationsService,
    private _router:Router,
    private _fuseConfirmationService: FuseConfirmationService,
    private _cauhinhService: CauhinhService,

    private _uploadService: FileUploadService,
    private _sharedService : SharedService,
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
        this.Nhanviens = nhanvien;          
        this.filteredNhanvien = nhanvien; 
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
  RemoveDuan(item) {
    item.sid = "";
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    this.isOpenGroup =false;
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
    this.filteredNhanvien = this.Nhanviens;
  }
  filterThanvien(event): void
  {
    const value = event.target.value.toLowerCase();
    this.filteredNhanvien = this.Nhanviens.filter(v => v.name.toLowerCase().includes(value));
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
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
  }
  ChangeTask(item,type,value)
  {
    console.log(item,type,value);
    item[type] = value;
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
  }

  UpdateTask()
  {
    this._quanlycongviecService.UpdateTasks(this.CurretTask, this.CurretTask.id).subscribe();
    this.matDrawer.toggle();
  }
  DeleteTask()
  {
    const confirmation = this._fuseConfirmationService.open({
      title  : 'Xóa Đầu Việc',
      message: 'Bạn Có Chắc Chắn Xóa Đầu Việc Này',
      actions: {
          confirm: {
              label: 'Xóa'
          }
      }
  });
  confirmation.afterClosed().subscribe((result) => {
      if ( result === 'confirmed' )
      {
        this._quanlycongviecService.DeleteTasks(this.CurretTask.id).subscribe();
        this.matDrawer.toggle();
      }
  });

  }
  UpdateEditor(item, type,{editor}: ChangeEvent ) {   
    item[type] = editor.getData();
    this.CurretTask = item;
    console.log(item);
  }

}
