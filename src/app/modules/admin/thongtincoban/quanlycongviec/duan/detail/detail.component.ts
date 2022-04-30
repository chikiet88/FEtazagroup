import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  public Editor = InlineEditor;
  public config = {
    placeholder: 'Mô Tả Dự Án'
  };
  displayedColumns: string[] = ['#', 'tieude', 'deadline', 'uutien', 'duan'];
  Sections: any = [];
  Tasks: any = [];
  filteredSections: any;
  filteredTasks: any;
  filteredDuans: any;
  CUser: any;
  Uutiens: any[] = [];
  Duans: any[] = [];
  Nhanviens: any[] = [];
  Duan: any = {};
  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private _quanlycongviecService: QuanlycongviecService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _notifierService: NotifierService,
    private _userService: UserService,
    private _nhanvienServiceService: NhanvienService,
  ) {
    this._quanlycongviecService.getAllSection().subscribe();
    this._quanlycongviecService.getAllTasks().subscribe();
    this._quanlycongviecService.getAllDuans().subscribe();
    this._nhanvienServiceService.getNhanviens().subscribe();
    const id = this._activatedRoute.snapshot.paramMap.get('id');
    this._quanlycongviecService.getDuanById(id).subscribe();
    this._quanlycongviecService.duan$.subscribe((data) => {
      this.Duan = data;
      console.log(data);
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
        console.log(data);
        
        this.Nhanviens = data;
        this._changeDetectorRef.markForCheck();
      });
    this._quanlycongviecService.sections$.subscribe((data) => {
      this.Sections = this.filteredSections = data;
      console.log(data);
      this._changeDetectorRef.markForCheck();
    })
    this._quanlycongviecService.tasks$.subscribe((data) => {
      this.Tasks = this.filteredTasks = data;
      console.log(data);
      this._changeDetectorRef.markForCheck();
    })
    this._quanlycongviecService.duans$.subscribe((data) => {
      this.Duans = this.filteredDuans = data;
      console.log(data);
      this._changeDetectorRef.markForCheck();
    })
  }

  ngOnInit(): void {
    const id = this._activatedRoute.snapshot.paramMap.get('id');
    this._quanlycongviecService.getDuanById(id).subscribe();
    console.log(id);
  }
  GetdataSource(item) {
    return this.Tasks.filter(v => v.sid == item.id);
  }
  CreateSection() {
    const section = { Tieude: "New Section", IsOpen: true, idTao: this.CUser.id, type: 1 }
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
