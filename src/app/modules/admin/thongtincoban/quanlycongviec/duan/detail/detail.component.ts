import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import Editor from 'ckeditor5/build/ckEditor';
import { NotifierService } from 'angular-notifier';
import { UserService } from 'app/core/user/user.service';
import { NhanvienService } from 'app/modules/admin/baocao/nhanvien/nhanvien.service';
import { Subject, takeUntil } from 'rxjs';
import { QuanlycongviecService } from '../../quanlycongviec.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { QuanlycongviecComponent } from '../../quanlycongviec.component';
import { CauhinhService } from 'app/modules/admin/cauhinh/cauhinh.service';
import { Cauhinh } from 'app/modules/admin/cauhinh/cauhinh.types';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailComponent implements OnInit {
  selectedIndex:any
  isOpen = false;
  ThanhvienisOpen = false;
  public Editor = Editor ;
  public onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
  }
  displayedColumns: string[] = ['#', 'tieude', 'deadline', 'uutien', 'thuchien'];
  Sections: any[] = [];
  Tasks: any[] = [];
  Grouptasks: any[] = [];
  filteredSections: any;
  filteredTasks: any;
  filteredDuans: any;
  filterNhanviens:any;
  CUser: any;
  Uutiens: any[] = [];
  Duans: any[] = [];
  Nhanviens: any[] = [];
  Duan: any = {};
  pjid: any;
  SelectThuchien: any;
  triggerOrigin:any;
  private _unsubscribeAll: Subject<any> = new Subject();
  view:any ;
  listview:any;
  Phongban:any;
  Khoi:any;
  Congty:any;
  Bophan:any;
  Vitri:any;
  Chinhanh:any;
  constructor(
    private _quanlycongviecService: QuanlycongviecService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _location: Location,
    private _notifierService: NotifierService,
    private _userService: UserService,
    private _nhanvienServiceService: NhanvienService,
    private _quanlycongviecComponent: QuanlycongviecComponent,
    private _cauhinhService: CauhinhService,
    private _notificationsService: NotificationsService,
    
  ) {
    this._userService.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data) => {
      this.CUser = data;
      this._changeDetectorRef.markForCheck();
    });
    this._quanlycongviecService.getAllSection().subscribe();
    this._quanlycongviecService.getAllTasks().subscribe();
    //this._quanlycongviecService.getBoards();
    //this._nhanvienServiceService.getNhanviens().subscribe();
    this.pjid = this._activatedRoute.snapshot.paramMap.get('id');   
    this._quanlycongviecService.duan$.subscribe((data) => {
      this.Duan = data;
      this.view = data.selectedIndex;
      this._quanlycongviecService.sections$.subscribe((data) => {
        this.Sections = this.filteredSections = data.filter(v=>v.pjid == this.Duan.id);
        this._changeDetectorRef.markForCheck();
      })
      this._quanlycongviecService.tasks$.subscribe((data) => {
        this.Tasks = this.filteredTasks = data.filter(v=>v.idTao == this.CUser.id || v.Thuchien==this.CUser.id);
        this._changeDetectorRef.markForCheck();
      })
      this._quanlycongviecService.duans$.subscribe((data) => {
        this.Duans = this.filteredTasks = data.filter(v=>v.idTao == this.CUser.id || v.Thamgia.some(v2=>v2==this.CUser.id));
        this._changeDetectorRef.markForCheck();
      })
      this._changeDetectorRef.markForCheck();
   })
    this._nhanvienServiceService.nhanviens$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.Nhanviens = this.filterNhanviens = data;
        this._changeDetectorRef.markForCheck();
      });

   this._quanlycongviecService.boards$.subscribe((data) => {
        this.Grouptasks = data
        this._changeDetectorRef.markForCheck();
      })
      this._cauhinhService.Cauhinhs$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: Cauhinh[]) => {
        console.log(data);
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
    this.isOpen = false;
    this.ThanhvienisOpen = false;
    this.listview = [
      {id:1,title:"Tổng Quan",value:'info',tooltip:'Tổng Quan'},
      {id:2,title:"Đầu Việc",value:'view_kanban',tooltip:'Đầu Việc'},
      {id:3,title:"Timeline",value:'view_timeline',tooltip:'Timeline'},
      {id:4,title:"Dashboard",value:'pie_chart',tooltip:'Dashboard'},
      {id:5,title:"Tin Nhắn",value:'question_answer',tooltip:'Tin Nhắn'},
    ]
  }
  ChangeStatusDuan(status) {
    this.Duan.Trangthai = status;
    delete this.Duan.sections;
    this._quanlycongviecService.UpdateDuans(this.Duan,this.Duan.id).subscribe();
    this.ngOnInit();
  }
  chosenView(view)
  {
    this.view = view;
    this.Duan.selectedIndex = view;
    delete this.Duan.sections;
    this._quanlycongviecService.UpdateDuans(this.Duan,this.Duan.id).subscribe();
  }
  changeEditorToolbar(displayValue)
  {
      let elements =  Array.from(document.getElementsByClassName('ck-editor__top') as HTMLCollectionOf<HTMLElement>);
      elements[0].style.display = displayValue;
  }
  filterThanvien(event): void
  {
    const value = event.target.value.toLowerCase();
    this.filterNhanviens = this.Nhanviens.filter(v => v.name.toLowerCase().includes(value));
  }

  toggleThuchien(trigger: any,row) {
    this.SelectThuchien = row;
    this.triggerOrigin = trigger;
    this.isOpen = !this.isOpen
  }
  toggleThanhvien(trigger: any) {
    this.triggerOrigin = trigger;
    this.ThanhvienisOpen = !this.ThanhvienisOpen
    this.filterNhanviens = this.Nhanviens
  }
  UpdateTask(item,type, value) {   
    item[type] = value;
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    this.ngOnInit();
  }
  EditSection(event, item) {
    item.Tieude = event.target.value;
    this._quanlycongviecService.UpdateSection(item, item.id).subscribe();
  }
  UpdateSection(item, type, value) {    
    item[type] = value;
    this._quanlycongviecService.UpdateDuans(item, item.id).subscribe();
  }
  GetdataSource(item) {
    return this.Tasks.filter(v => v.sid == item.id);
  }
  CreateSection() {
    let section = { Tieude: "New Section", IsOpen: true, idTao: this.CUser.id,pjid:this.pjid, Loai: 'duan' }
    if (this.Sections.length != 0 && this.Sections[0].Tieude == "New Section") {
      this._notifierService.notify('error', 'Có Section Mới Chưa Đổi Tên');
    }
    else {
      this._quanlycongviecService.CreateSection(section).subscribe();
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
  DeleteSection(item) {
    this._quanlycongviecService.DeleteSection(item.id).subscribe();
  }
  UpdateDuan(item, type, value) {      
    item[type] = value;
    delete item.sections;
    this._quanlycongviecService.UpdateDuans(item, item.id).subscribe();
    this._notifierService.notify('success', 'Cập Nhật Thành Công');
  }
  AddMang(item, type, value) {   
    item[type].push(value);
    delete item.sections;
    this._quanlycongviecService.UpdateDuans(item, item.id).subscribe();
    const notifi = {
      idFrom:  this.CUser.id,
      idTo: value,
      Tieude: "Thêm Vào Dự Án",
      Noidung: this.Duan.Tieude,
      Lienket: `${this._router.url}`,
    };
    this._notificationsService.create(notifi).subscribe();
    this.isOpen =false
    //this.ngOnInit();
  }
  RemoveMang(item, type, value) {   
    item[type]= item[type].filter(v=>v!=value);
    this._quanlycongviecService.UpdateDuans(item, item.id).subscribe();
    this.ngOnInit();
  }
  UpdateEditorDuan(item, type,{editor}: ChangeEvent ) {   
    item[type] = editor.getData();
    this._quanlycongviecService.UpdateDuans(item, item.id).subscribe();
    this._notifierService.notify('success', 'Cập Nhật Thành Công');
  }
  EditTasks(event, item) {
    item.Tieude = event.target.value;
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
  }
  ChangeStatusTasks(item, status) {
    item.Trangthai = status;
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    this.ngOnInit();
  }
  UpdateDeadline(item, value) {
    item.Deadline = value;
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    this.ngOnInit();
  }
  UpdateUutien(item, value) {
    item.Uutien = value;
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    this.ngOnInit();
  }
  toggleSection(item) {
    item.IsOpen = !item.IsOpen;
    this._quanlycongviecService.UpdateSection(item, item.id).subscribe();
  }
  UpdateSelectIndex(item,event: MatTabChangeEvent)
  {
    item.selectedIndex = event.index;
    delete item.sections;
    this._quanlycongviecService.UpdateDuans(item, item.id).subscribe();
  }
  MenuToggle()
  {
     this._quanlycongviecComponent.matDrawerMenu.toggle();
  }
}
