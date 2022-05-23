import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ScrumboardService } from 'app/modules/admin/apps/scrumboard/scrumboard.service';
import { Board, Card, List } from 'app/modules/admin/apps/scrumboard/scrumboard.models';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import moment from 'moment';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { clone } from 'lodash';
import { QuanlycongviecService } from '../../quanlycongviec.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { UserService } from 'app/core/user/user.service';
import { NhanvienService } from 'app/modules/admin/baocao/nhanvien/nhanvien.service';
import { QuanlycongviecComponent } from '../../quanlycongviec.component';
@Component({
  selector: 'app-duanboard',
  templateUrl: './duanboard.component.html',
  styleUrls: ['./duanboard.component.scss']
})
export class DuanboardComponent implements OnInit {
  listTitleForm: FormGroup;
  @ViewChild('titleInput') titleInput: ElementRef;
  BoardGrouptasks:any;
  form: FormGroup;
  formVisible: boolean = false;
  filteredGrouptasks: any;
  filteredTasks: any;
  filteredDuans: any;
  CUser: any;
  Uutiens:any[];
  Duans:any[];
  Duan:any;
  triggerOrigin1 :any;
  triggerOrigin :any;
  isOpenDuan = false;
  isOpenUser = false;
  SelectCard:any;
  TasksNoGroup:any; 
  Grouptasks: any[] = [];
  Boards: any[] = [];
  Tasks: any[] = [];
  Sections: any[] = [];
  Nhanviens: any;
  filterNhanviens:any;
  Overgroup:any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @Output() readonly GetTask: EventEmitter<any> = new EventEmitter<any>();
  Duansections :any;
  constructor(
    private _scrumboardService:ScrumboardService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    private _quanlycongviecService: QuanlycongviecService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _notifierService: NotifierService,
    private _userService: UserService,
    private _nhanvienServiceService: NhanvienService,
    public _quanlycongviecComponent:QuanlycongviecComponent,
    
    ) {
        this._userService.user$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data) => {
          this.CUser = data;
          this._changeDetectorRef.markForCheck();         
        });  
        this._quanlycongviecService.getDuanBoards();
        this._quanlycongviecService.getDuans();
     }
    ngOnInit(): void
     {
      this._nhanvienServiceService.getNhanviens().subscribe();
        this._nhanvienServiceService.nhanviens$.subscribe((data) => { 
          this.Nhanviens = data
          console.log(data);
          
          this._changeDetectorRef.markForCheck();
        })
        this._quanlycongviecService.grouptasks$.subscribe((data) => {
          this.Grouptasks = this.filteredTasks = data.filter(v=>v.idTao==this.CUser.id)
          this._changeDetectorRef.markForCheck();
        })
        this._quanlycongviecService.tasks$.subscribe((data) => {
          this.Tasks = this.filteredTasks = data.filter(v=>v.idTao==this.CUser.id ||v.Thuchien==this.CUser.id)
          this._changeDetectorRef.markForCheck();
        })
        this._quanlycongviecService.sections$.subscribe((data) => {
          this.Sections = data.filter(v=>v.idTao==this.CUser.id)
          this._changeDetectorRef.markForCheck();
        })
        this._quanlycongviecService.duans$.subscribe((data) => {
          this.Duans = this.filteredDuans = data
          this._changeDetectorRef.markForCheck();
        })
        this._quanlycongviecService.duan$.subscribe((data) => {
          console.log(data);
          
          this.Duan = data
          this.filterNhanviens = data.Thamgia;
          this._changeDetectorRef.markForCheck();
        })
         this.listTitleForm = this._formBuilder.group({
             title: ['']
         });
         this.form = this._formBuilder.group({
            title: ['']
        });
        this._quanlycongviecService.duanboards$.subscribe((data)=>
        {
            this.Boards = data;
        })
        this._quanlycongviecService.Duansections$.subscribe((data)=>{
          this.Duansections = data
          ;})
     }
     ngOnDestroy(): void
     {
         this._unsubscribeAll.next(null);
         this._unsubscribeAll.complete();
     }
     OpenEdit(card)
     {
        this._quanlycongviecService.changeTask(card);
        this._quanlycongviecComponent.matDrawer.toggle();
        
     }
     CloseMat()
     {
        this._quanlycongviecComponent.matDrawer.close();
     }
     renameList(listTitleInput: HTMLElement): void
     {
         setTimeout(() => {
             listTitleInput.focus();
         });
     }
     addList(title: string): void
     {
       console.log(title);
       console.log(this.Sections);
        let ordering = 0;
         if(this.Sections.length!=0){ordering = Math.max(...this.Sections.map(o => o.Ordering)) + 1}
         let section = { Tieude: title,pjid:this.Duan.id, IsOpen: true, idTao: this.CUser.id,Ordering:ordering}  
         this._quanlycongviecService.CreateSection(section).subscribe();
     }
     updateListTitle(event: any, list): void
     {
         const element: HTMLInputElement = event.target;
         const newTitle = element.value;
         if ( !newTitle || newTitle.trim() === '' )
         {
             element.value = list.title;
             return;
         }
         list.Tieude = element.value = newTitle.trim();
         delete list.tasks;
         this._quanlycongviecService.UpdateSection(list,list.id).subscribe();
     }
     deleteGroup(item): void
     {
         console.log(item.tasks.length);
         console.log(item);
         
         if(item.tasks.length==0)
         {
            const confirmation = this._fuseConfirmationService.open({
                title  : 'Xóa Section',
                message: 'Bạn Có Chắc Chắn Xóa Section Này',
                actions: {
                    confirm: {
                        label: 'Xóa'
                    }
                }
            });
            confirmation.afterClosed().subscribe((result) => {
                if ( result === 'confirmed' )
                {
                    this._quanlycongviecService.DeleteSection(item.id).subscribe();
                }
            });
         }
         else { this._notifierService.notify('error', 'Section Có Đầu Việc. Vui Lòng Xóa Hết Đầu Việc Trước Khi Xóa Section'); }
     }
     addCard(list: any, title: string): void
     {         
         const task = { Tieude: title, sid: list.id, idTao: this.CUser.id }
         this._quanlycongviecService.CreateTasks(task).subscribe(
         );
     }

     listDropped(event: CdkDragDrop<List[]>): void
     {
         //change ordering
         console.log(event);
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
     }
     cardDropped(event: CdkDragDrop<any[]>,list): void
     {
         console.log(event.container.data);
         if ( event.previousContainer === event.container )
         {             
             moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);     
         }
         else
         {
             transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
             event.container.data[event.currentIndex].sid = event.container.id;    
             const item  = event.container.data[event.currentIndex]
             this._quanlycongviecService.UpdateTasks(item,item.id).subscribe();

         }
 
     }
 
     isOverdue(date: string): boolean
     {
         return moment(date, moment.ISO_8601).isBefore(moment(), 'days');
     }
     trackByFn(index: number, item: any): any
     {
         return item.id || index;
     }
     toggleFormVisibility(): void
     {
         this.formVisible = !this.formVisible;
         if ( this.formVisible )
         {
             this.titleInput.nativeElement.focus();
         }
     }
     ChangeStatusTasks(item, status) {
        item.Trangthai = status;
        this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
        this.ngOnInit();
      }
      UpdateDeadlineTask(item,StartValue,EndValue)
      {
        item.Batdau = StartValue;
        item.Ketthuc = EndValue;
        this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
      }
      toggleGroup(trigger: any,item) {
        this.Overgroup = this.Grouptasks.filter(v=>v.idTao ==item.Thuchien)
        console.log(this.Overgroup);
        this.triggerOrigin = trigger;
        this.isOpenDuan = !this.isOpenDuan
      }
      toggleUser(trigger: any,item) {
        this.SelectCard = item;
        this.triggerOrigin1 = trigger;
        this.isOpenUser = !this.isOpenUser
      }
      ChonGroup(item,id) {
        item.gid = id;
        this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
        this.isOpenDuan =false;
      }
      ChonUser(item,id) {
        item.Thuchien = id;
        this._quanlycongviecService.UpdateTasks(item, item.id).subscribe();
        this.isOpenUser =false;
      }
}
