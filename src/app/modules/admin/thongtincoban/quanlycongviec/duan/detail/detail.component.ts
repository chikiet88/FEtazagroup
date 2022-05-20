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
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailComponent implements OnInit {
  selectedIndex:any
  toMilliseconds(minutes) {
    return minutes * 60 * 1000;
  }
  title = 'Browser market shares at a specific website, 2014';
  type = 'Gantt';
  chartColumns = [
    { type: 'string', id: 'ID' },
    { type: 'string', id: 'Titlte' },
    { type: 'string', id: 'Resource' },
    { type: 'date', id: 'Start' },
    { type: 'date', id: 'End' },
    { type: 'number', id: 'Duration' },
    { type: 'number', id: 'Percent Complete' },
    { type: 'string', id: 'Dependencies' },
  ]
  homnay = new Date();
  data = [
    [
      "toTrain",
      "Walk to train stop",
      "walk",
      this.homnay,
      this.homnay,
      this.toMilliseconds(5),
      100,
      null,
    ],
    [
      "music",
      "Listen to music",
      "music",
      null,
      null,
      this.toMilliseconds(70),
      100,
      null,
    ],
    [
      "wait",
      "Wait for train",
      "wait",
      null,
      null,
      this.toMilliseconds(10),
      100,
      "toTrain",
    ],
    [
      "train",
      "Train ride",
      "train",
      null,
      null,
      this.toMilliseconds(45),
      75,
      "wait",
    ],
    [
      "toWork",
      "Walk to work",
      "walk",
      null,
      null,
      this.toMilliseconds(10),
      0,
      "train",
    ]
  ];
  options = {
    height: 275,
    gantt: {
      criticalPathEnabled: false, // Critical path arrows will be the same as other arrows.
      arrow: {
        angle: 50,
        width: 1,
        color: 'white',
        radius: 2
      },
      labelStyle: {
        fontName: 'Open Sans',
        fontSize: 14,
        color: 'white'
      },
      barCornerRadius: 2,
      backgroundColor: {
        fill: 'transparent',
      },
      innerGridHorizLine: {
        stroke: '#ddd',
        strokeWidth: 0,
      },
      innerGridTrack: {
        fill: 'transparent'
      },
      innerGridDarkTrack: {
        fill: 'transparent'
      },
      percentEnabled:	true, 
      shadowEnabled: true,	
      shadowColor: 'white',
      shadowOffset: 2,
    }
  };

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
    this._quanlycongviecService.getAllSection().subscribe();
    this._quanlycongviecService.getAllTasks().subscribe();
    this._quanlycongviecService.getBoards();
    this._nhanvienServiceService.getNhanviens().subscribe();
    this.pjid = this._activatedRoute.snapshot.paramMap.get('id');   
    this._quanlycongviecService.duan$.subscribe((data) => {
      this.Duan = data;
      this.selectedIndex = data.selectedIndex;
      console.log("Duan",data);
      this._quanlycongviecService.sections$.subscribe((data) => {
        console.log("Section",data);
        this.Sections = this.filteredSections = data.filter(v=>v.pjid == this.Duan.id);
        this._changeDetectorRef.markForCheck();
      })
      this._quanlycongviecService.tasks$.subscribe((data) => {
        console.log("tasks",data);
        this.Tasks = this.filteredTasks = data.filter(v=>v.idTao == this.CUser.id || v.Thuchien==this.CUser.id);
        this._changeDetectorRef.markForCheck();
      })
      this._quanlycongviecService.duans$.subscribe((data) => {
        console.log("Duans",data);
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
     console.log(data);
        this.Grouptasks = data
        this._changeDetectorRef.markForCheck();
      })
  }

  ngOnInit(): void {
    this.isOpen = false;
    this.ThanhvienisOpen = false;
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
  }
  UpdateTask(item,type, value) {   
    item[type] = value;
    this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
    this.ngOnInit();
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
    console.log(item, type, value);
     item[type].push(value);
    this._quanlycongviecService.UpdateDuans(item, item.id).subscribe();
    this.ngOnInit();
  }
  RemoveMang(item, type, value) {   
    item[type]= item[type].filter(v=>v!=value);
    this._quanlycongviecService.UpdateDuans(item, item.id).subscribe();
    this.ngOnInit();
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
  UpdateSelectIndex(item,event: MatTabChangeEvent)
  {
    item.selectedIndex = event.index;
    console.log(item,event.index);
    delete item.sections;
    this._quanlycongviecService.UpdateDuans(item, item.id).subscribe();
  }
}
