import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { UserService } from 'app/core/user/user.service';
import { NhanvienService } from 'app/modules/admin/baocao/nhanvien/nhanvien.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { QuanlycongviecService } from '../quanlycongviec.service';
@Component({
  selector: 'app-dauviec',
  templateUrl: './dauviec.component.html',
  styleUrls: ['./dauviec.component.scss']
})
export class DauviecComponent implements OnInit {
  displayedColumns: string[] = ['#', 'tieude', 'ngaytao'];
  Sections: any = [];
  Tasks: any = [];
  filteredSections: any;
  filteredTasks: any;
  CUser: any;
  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private _quanlycongviecService: QuanlycongviecService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _notifierService: NotifierService,
    private _userService: UserService,
    private _nhanvienServiceService: NhanvienService,
  ) { }
  ngOnInit(): void {
    this._userService.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data) => {
      this.CUser = data;
      this._changeDetectorRef.markForCheck();         
    });         
    this._quanlycongviecService.getAllSection().subscribe();
    this._quanlycongviecService.sections$.subscribe((data) => {
      this.Sections = this.filteredSections = data;
      console.log(data);
      this._changeDetectorRef.markForCheck();
    })
    this._quanlycongviecService.getAllTaks().subscribe();
    this._quanlycongviecService.tasks$.subscribe((data) => {
      this.Tasks = this.filteredTasks = data;
      console.log(data);
      this._changeDetectorRef.markForCheck();
    })
  }
  GetdataSource(item) {
    return this.Tasks.filter(v => v.sid == item.id);
  }
  createSection() {
    const section = { Tieude: "New Section",IsOpen:true,idTao:this.CUser.id}
    if (this.Sections.length == 0) {
      this._quanlycongviecService.CreateSection(section).subscribe((newsection) => {
        this._router.navigate(['./', newsection.id], { relativeTo: this._activatedRoute });
        this._changeDetectorRef.markForCheck();
      });
    }
    else {
      const Tieude = this.Sections[0].Tieude;
      if (Tieude == "New Section") {
        this._notifierService.notify('error', 'Có Section Mới Chưa Đổi Tên');
        const filterValue = "New Section";
        //this.dataSource.filter = filterValue.trim().toLowerCase();
        //this.filterByQuery("Mới");
      }
      else {

        this._quanlycongviecService.CreateSection(section).subscribe((newsection) => {
          this._router.navigate(['./', newsection.id], { relativeTo: this._activatedRoute });
          this._changeDetectorRef.markForCheck();
        });
      }
    }
  }
  CreateTaks(idSection) {
    const task = { Tieude: "New Task", sid: idSection,idTao:this.CUser.id}
    const checktask = this.Tasks.filter(v => v.sid == idSection);
    if (checktask.length == 0) {
      this._quanlycongviecService.CreateTaks(task).subscribe((newtask) => {
        this._router.navigate(['./', newtask.id], { relativeTo: this._activatedRoute });
        this._changeDetectorRef.markForCheck();
      });
    }
    else {
      const Tieude = checktask[0].Tieude;
      if (Tieude == "New Task") {
        this._notifierService.notify('error', 'Có Task Mới Chưa Đổi Tên');
        const filterValue = "New Task";
      }
      else {

        this._quanlycongviecService.CreateTaks(task).subscribe((newtask) => {
          this._router.navigate(['./', newtask.id], { relativeTo: this._activatedRoute });
          this._changeDetectorRef.markForCheck();
        });
      }
    }
  }
  DeleteSection(item) {
    this._quanlycongviecService.DeleteSection(item.id).subscribe();
  }
  EditSection(event, item) {
    item.Tieude = event.target.value;
    this._quanlycongviecService.UpdateSection(item, item.id).subscribe();
    console.log(event.target.value);
    console.log(item);
  }
  EditTasks(event, item) {
    item.Tieude = event.target.value;
    this._quanlycongviecService.UpdateTaks(item, item.id).subscribe();
    console.log(event.target.value);
    console.log(item);
  }
  ChangeStatusTasks(item, status) {
    item.Trangthai = status;
    this._quanlycongviecService.UpdateTaks(item, item.id).subscribe();
    this.ngOnInit();
  }
  toggleSection(item) {
    item.IsOpen = !item.IsOpen;
    this._quanlycongviecService.UpdateSection(item, item.id).subscribe();
  }

}
