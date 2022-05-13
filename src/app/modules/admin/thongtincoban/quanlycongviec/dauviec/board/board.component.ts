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
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
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
  triggerOrigin :any;
  isOpenDuan = false;
  SelectDuan:any;
  TasksNoGroup:any;
  Grouptasks: any[] = [];
  Boards: any[] = [];
  Tasks: any[] = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @Output() readonly GetTask: EventEmitter<any> = new EventEmitter<any>();

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
        this._quanlycongviecService.getGrouptasksByuser(this.CUser.id).subscribe();
        this._quanlycongviecService.getTasksByuser(this.CUser.id).subscribe();
        this._quanlycongviecService.getDuanByuser(this.CUser.id).subscribe();
        this._quanlycongviecService.getSectionByuser(this.CUser.id).subscribe();
     }
    ngOnInit(): void
     {
        this._quanlycongviecService.getBoards();
        this._quanlycongviecService.grouptasks$.subscribe((data) => {
          this.Grouptasks = this.filteredTasks = data
          this._changeDetectorRef.markForCheck();
        })
        this._quanlycongviecService.tasks$.subscribe((data) => {
          this.Tasks = this.filteredTasks = data
          this._changeDetectorRef.markForCheck();
        })
        this._quanlycongviecService.duans$.subscribe((data) => {
          this.Duans = this.filteredDuans = data
          this._changeDetectorRef.markForCheck();
        })
        this._quanlycongviecService.boards$.subscribe((data)=>
        {
            this.Boards = data; 
        })
         this.listTitleForm = this._formBuilder.group({
             title: ['']
         });
         this.form = this._formBuilder.group({
            title: ['']
        });
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
     renameList(listTitleInput: HTMLElement): void
     {
         setTimeout(() => {
             listTitleInput.focus();
         });
     }
     addList(title: string): void
     {
        let ordering = 0;
         if(this.Grouptasks.length!=0){ordering = Math.max(...this.Grouptasks.map(o => o.Ordering)) + 1}
         let group = { Tieude: title, IsOpen: true, idTao: this.CUser.id,Ordering:ordering}  
         this._quanlycongviecService.CreateGrouptasks(group).subscribe();
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
         this._quanlycongviecService.UpdateGrouptasks(list,list.id).subscribe();
     }
     deleteGroup(item): void
     {
         console.log(item.tasks.length);
         
         if(item.tasks.length==0)
         {
            const confirmation = this._fuseConfirmationService.open({
                title  : 'Xóa Group',
                message: 'Bạn Có Chắc Chắn Xóa Group Này',
                actions: {
                    confirm: {
                        label: 'Xóa'
                    }
                }
            });
            confirmation.afterClosed().subscribe((result) => {
                if ( result === 'confirmed' )
                {
                    this._quanlycongviecService.DeleteGrouptasks(item.id).subscribe();
                }
            });
         }
         else { this._notifierService.notify('error', 'Group Có Đầu Việc. Vui Lòng Xóa Hết Đầu Việc Trước Khi Xóa Group'); }
     }
     addCard(list: any, title: string): void
     {
        //  // Create a new card model
        //  const card = new Card({
        //      boardId : this.board.id,
        //      listId  : list.id,
        //      position: list.cards.length ? list.cards[list.cards.length - 1].position + this._positionStep : this._positionStep,
        //      title   : title
        //  });
        // console.log(list);
        //  const x =  this.Grouptasks.find(v=>v.id ==list.id);
         const task = { Tieude: title, gid: list.id, idTao: this.CUser.id }
        // const index = this.Grouptasks.findIndex(item => item.id === list.id);
        // this.Grouptasks[index].cards.unshift(task);
        // this._Grouptasks.next(this.Grouptasks);
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
             console.log('true');
             
             moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
             
         }
         else
         {

             transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
             event.container.data[event.currentIndex].gid = event.container.id;    
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
}
