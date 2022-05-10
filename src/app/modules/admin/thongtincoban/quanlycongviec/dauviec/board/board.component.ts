import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ScrumboardService } from 'app/modules/admin/apps/scrumboard/scrumboard.service';
import { Board, Card, List } from 'app/modules/admin/apps/scrumboard/scrumboard.models';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import moment from 'moment';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { clone } from 'lodash';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  listTitleForm: FormGroup;
  @Input() TTasks!:any;
  @Input() TDuans!:any;
  @Input() TTasksNoGroup!:any;
  @Input() TGrouptasks!:any;
  @Input() TCUser!:any;
  BoardGrouptasks:any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _scrumboardService:ScrumboardService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    ) { }
    ngOnInit(): void
     {
        this.BoardGrouptasks = clone(this.TGrouptasks);
         clone(this.BoardGrouptasks).forEach(v => {
             v.cards = this.TTasks.filter(v1=>v1.gid==v.id)
         });
         const nogroup = {
            "id": "0",
            "Tieude": "Chưa có group",
            "Mota": "",
            "Ordering": 0,
            "Trangthai": "0",
            "IsOpen": true,
            "Ngaytao": null,
            "idTao": this.TCUser.id,
            "cards": this.TTasksNoGroup,
            "title": "New Group"
        };
        this.BoardGrouptasks.unshift(nogroup);
        
         console.log(this.BoardGrouptasks);
         this.listTitleForm = this._formBuilder.group({
             title: ['']
         });
     }
     ngOnDestroy(): void
     {
         this._unsubscribeAll.next(null);
         this._unsubscribeAll.complete();
     }
     renameList(listTitleInput: HTMLElement): void
     {
         setTimeout(() => {
             listTitleInput.focus();
         });
     }
     addList(title: string): void
     {
         if ( this.BoardGrouptasks.lists.length >= 200 )
         {
             return;
         }
         const list = new List({
             boardId : this.BoardGrouptasks.id,
             position: 0,
             title   : title
         });
         this._scrumboardService.createList(list).subscribe();
     }
     updateListTitle(event: any, list: List): void
     {
         const element: HTMLInputElement = event.target;
         const newTitle = element.value;
         if ( !newTitle || newTitle.trim() === '' )
         {
             element.value = list.title;
             return;
         }
         list.title = element.value = newTitle.trim();
         this._scrumboardService.updateList(list).subscribe();
     }
     deleteList(id): void
     {
         const confirmation = this._fuseConfirmationService.open({
             title  : 'Delete list',
             message: 'Are you sure you want to delete this list and its cards? This action cannot be undone!',
             actions: {
                 confirm: {
                     label: 'Delete'
                 }
             }
         });
         confirmation.afterClosed().subscribe((result) => {
             if ( result === 'confirmed' )
             {
                 this._scrumboardService.deleteList(id).subscribe();
             }
         });
     }
     addCard(list: List, title: string): void
     {
         const card = new Card({
             boardId : this.BoardGrouptasks.id,
             listId  : list.id,
             position: 0,
             title   : title
         });
 
         this._scrumboardService.createCard(card).subscribe();
     }
     listDropped(event: CdkDragDrop<List[]>): void
     {
         //change ordering
         console.log(event);
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
     }
     cardDropped(event: CdkDragDrop<Card[]>): void
     {
         console.log(event);
         
         if ( event.previousContainer === event.container )
         {
             moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
         }
         else
         {
             transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
             event.container.data[event.currentIndex].listId = event.container.id;
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
}
