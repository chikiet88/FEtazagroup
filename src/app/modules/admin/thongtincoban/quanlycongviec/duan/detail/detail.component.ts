import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { NotifierService } from 'angular-notifier';
import { UserService } from 'app/core/user/user.service';
import { NhanvienService } from 'app/modules/admin/baocao/nhanvien/nhanvien.service';
import { Subject, takeUntil } from 'rxjs';
import { QuanlycongviecService } from '../../quanlycongviec.service';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  isOpen = false;
  public Editor = InlineEditor;
  public config = {
    placeholder: 'Mô Tả Dự Án'
  };
  displayedColumns: string[] = ['#', 'tieude', 'deadline', 'uutien', 'thamgia'];
  Sections: any[] = [];
  Tasks: any[] = [];
  filteredSections: any;
  filteredTasks: any;
  filteredDuans: any;
  CUser: any;
  Uutiens: any[] = [];
  Duans: any[] = [];
  Nhanviens: any[] = [];
  Duan: any = {};
  pjid: any;
  triggerOrigin:any;
  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private _quanlycongviecService: QuanlycongviecService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _location: Location,
    private _notifierService: NotifierService,
    private _userService: UserService,
    private _nhanvienServiceService: NhanvienService,
    
  ) {
    this._userService.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data) => {
      this.CUser = data;
      this._changeDetectorRef.markForCheck();
    });
    this._quanlycongviecService.getSectionByType('duan').subscribe();
    this._quanlycongviecService.getAllTasks().subscribe();
    this._nhanvienServiceService.getNhanviens().subscribe();
    this.pjid = this._activatedRoute.snapshot.paramMap.get('id');   
    this._quanlycongviecService.getDuanById(this.pjid).subscribe();
    this._quanlycongviecService.duan$.subscribe((data) => {
      if(data.idTao != this.CUser.id && !data.Thamgia.includes(this.CUser.id))
      {
        this._location.back();
      }
      else
      {
        this.Duan = data;
      }
      console.log("Duan",data);
      this._quanlycongviecService.sections$.subscribe((data) => {
        console.log("Section",data);
        this.Sections = this.filteredSections = data.filter(v=>v.pjid == this.Duan.id);
        this._changeDetectorRef.markForCheck();
      })
      this._quanlycongviecService.tasks$.subscribe((data) => {
        console.log("tasks",data);
        this.Tasks = this.filteredTasks = data.filter(v=>v.idTao == this.CUser.id || v.Thamgia.some(v2=>v2==this.CUser.id));
        this._changeDetectorRef.markForCheck();
      })
      this._quanlycongviecService.duans$.subscribe((data) => {
        console.log("Duans",data);
        this.Duans = this.filteredTasks = data.filter(v=>v.idTao == this.CUser.id || v.Thamgia.some(v2=>v2==this.CUser.id));
        this._changeDetectorRef.markForCheck();
      })
      this._changeDetectorRef.markForCheck();
    })
    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.CUser = data;
        this._changeDetectorRef.markForCheck();
      });
    this._nhanvienServiceService.nhanviens$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.Nhanviens = data;
        this._changeDetectorRef.markForCheck();
      });
  }

  ngOnInit(): void {
  }
  toggle(trigger: any) {
    this.triggerOrigin = trigger;
    this.isOpen = !this.isOpen
  }
  EditSection(event, item) {
    item.Tieude = event.target.value;
    this._quanlycongviecService.UpdateSection(item, item.id).subscribe();
    console.log(event.target.value);
    console.log(item);
  }
  UpdateSection(item, type, value) {    
    item[type] = value;
    this._quanlycongviecService.UpdateDuans(item, item.id).subscribe();
    console.log(item);
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
      console.log(section);
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
    this._quanlycongviecService.UpdateDuans(item, item.id).subscribe();
    console.log(item);
  }
  AddMang(item, type, value) {   
     item[type].push(value);
    this._quanlycongviecService.UpdateDuans(item, item.id).subscribe();
  }
  RemoveMang(item, type, value) {   
    item[type]= item[type].filter(v=>v!=value);
    this._quanlycongviecService.UpdateDuans(item, item.id).subscribe();
  }
  UpdateEditorDuan(item, type,{editor}: ChangeEvent ) {   
    item[type] = editor.getData();
    this._quanlycongviecService.UpdateDuans(item, item.id).subscribe();
    console.log(item);
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
}
