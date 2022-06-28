import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ScrumboardService } from 'app/modules/admin/apps/scrumboard/scrumboard.service';
import { Board, Card, List } from 'app/modules/admin/apps/scrumboard/scrumboard.models';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import moment from 'moment';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { clone } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { UserService } from 'app/core/user/user.service';
import { NhanvienService } from 'app/modules/admin/baocao/nhanvien/nhanvien.service';
import { QuanlycongviecService } from '../../quanlycongviec/quanlycongviec.service';
import { CongviecService } from '../congviec.service';
import { SharedService } from 'app/shared/shared.service';
import { CongviecComponent } from '../congviec.component';
@Component({
  selector: 'app-congviecboard',
  templateUrl: './congviecboard.component.html',
  styleUrls: ['./congviecboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CongviecboardComponent implements OnInit,OnDestroy {
    listTitleForm: FormGroup;
    @ViewChild('titleInput') titleInput: ElementRef;
    BoardGrouptasks: any;
    form: FormGroup;
    formVisible: boolean = false;
    filteredGrouptasks: any;
    filteredTasks: any;
    filteredDuans: any;
    CUser: any;
    Uutiens: any[];
    Duans: any[];
    triggerOrigin: any;
    isOpenDuan = false;
    SelectDuan: any;
    ThisDuan: any;
    TasksNoGroup: any;
    Grouptasks: any[] = [];
    filteredGroups: any[] = [];
    Boards: any[] = [];
    Tasks: any[] = [];
    Sections: any[] = [];
    setScroll: [] = [];
    setInput: [] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @Output() readonly GetTask: EventEmitter<any> = new EventEmitter<any>();
    Duansections: any;
    isLoading: boolean;
    constructor(
        private _sharedService: SharedService,
        private _scrumboardService: ScrumboardService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _congviecService: CongviecService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _notifierService: NotifierService,
        private _userService: UserService,
        private _nhanvienServiceService: NhanvienService,
        private _formBuilder: FormBuilder,
        private _congviecComponent: CongviecComponent,
    ) {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                this.CUser = data;
                this._changeDetectorRef.markForCheck();
            });
            this._congviecService.getAllDuans().subscribe();
            this._congviecService.duans$.subscribe((data) => {
                this.Duans = this.filteredDuans = data
                this._changeDetectorRef.markForCheck();
            })
            this._congviecService.getAllTasks().subscribe();
            this._congviecService.tasks$.subscribe((data) => {
                this.Tasks = this.filteredTasks  = data                         
                this._changeDetectorRef.markForCheck();
            }) 
            this._congviecService.duan$.subscribe((data) => {
                this.ThisDuan = data; 
                this._changeDetectorRef.markForCheck();
            }) 
            this._congviecService.getAllGrouptasks().subscribe();
            this._congviecService.grouptasks$.subscribe((data) => {  
                this.Grouptasks = this.filteredGroups = data;
            })      
            this._congviecService.getBoards();
            this._congviecService.boards$.subscribe((data) => {  
                this.Boards = data
            })      
         }
    ngOnInit(): void {      
        this.listTitleForm = this._formBuilder.group({
            title: ['']
        });
        this.form = this._formBuilder.group({
            title: ['']
        });
    }
    ngAfterViewInit() {

    }
    OpenEdit(item) {
        console.log(item);
        //this._quanlycongviecService.changeTask(card);
        this._congviecComponent.drawer1.toggle();
    }
    ChangeTask(item, type, value) {
        item[type] = value;
        this._congviecService.UpdateTasks(item, item.id).subscribe();
        this._notifierService.notify('success', 'Cập Nhật Thành Công');
    }
    DeleteCard(item) {
        console.log(item);

        const confirmation = this._fuseConfirmationService.open({
            title: 'Xóa Đầu Việc',
            message: 'Bạn Có Chắc Chắn Xóa Đầu Việc Này',
            actions: {
                confirm: {
                    label: 'Xóa'
                }
            }
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._congviecService.DeleteTasks(item.id).subscribe();
            }
        });
    }
    renameList(listTitleInput: HTMLElement): void {
        setTimeout(() => {
            listTitleInput.focus();
        });
    }
    addList(title: string): void {
        let ordering = 0;
        if (this.Grouptasks.length != 0) { ordering = Math.max(...this.Grouptasks.map(o => o.Ordering)) + 1 }
        let group = { Tieude: title, IsOpen: true, idTao: this.CUser.id, Ordering: ordering,pid:this.ThisDuan.id }
        this._congviecService.CreateGrouptasks(group).subscribe();
    }
    updateListTitle(event: any, list): void {
        const element: HTMLInputElement = event.target;
        const newTitle = element.value;
        if (!newTitle || newTitle.trim() === '') {
            element.value = list.title;
            return;
        }
        list.Tieude = element.value = newTitle.trim();
        delete list.tasks;
        this._congviecService.UpdateGrouptasks(list, list.id).subscribe();
    }
    deleteGroup(item): void {
        console.log(item.tasks.length);

        if (item.tasks.length == 0) {
            const confirmation = this._fuseConfirmationService.open({
                title: 'Xóa Group',
                message: 'Bạn Có Chắc Chắn Xóa Group Này',
                actions: {
                    confirm: {
                        label: 'Xóa'
                    }
                }
            });
            confirmation.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    this._congviecService.DeleteGrouptasks(item.id).subscribe();
                }
            });
        }
        else { this._notifierService.notify('error', 'Group Có Đầu Việc. Vui Lòng Xóa Hết Đầu Việc Trước Khi Xóa Group'); }
    }
    addCard(list: any, title: string): void {
        const task = { Tieude: title, gid: list.id, idTao: this.CUser.id }
        this._congviecService.CreateTasks(task).subscribe();
        this.ngOnInit();
    }

    listDropped(event: CdkDragDrop<List[]>): void {
        //change ordering
        console.log(event);
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    cardDropped(event: CdkDragDrop<any[]>, list): void {
        console.log(event.container.data);
        if (event.previousContainer === event.container) {
            console.log('true');

            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

        }
        else {

            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
            event.container.data[event.currentIndex].gid = event.container.id;
            const item = event.container.data[event.currentIndex]
            this._congviecService.UpdateTasks(item, item.id).subscribe();

        }

    }

    isOverdue(date: string): boolean {
        return moment(date, moment.ISO_8601).isBefore(moment(), 'days');
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    toggleFormVisibility(): void {
        this.formVisible = !this.formVisible;
        if (this.formVisible) {
            this.titleInput.nativeElement.focus();
        }
    }
    ChangeStatusTasks(item, status) {
        item.Trangthai = status;
        this._congviecService.UpdateTasks(item, item.id).subscribe();
        this.ngOnInit();
    }
    UpdateDeadlineTask(item, StartValue, EndValue) {
        item.Batdau = StartValue;
        item.Ketthuc = EndValue;
        this._congviecService.UpdateTasks(item, item.id).subscribe();
    }
    toggleDuan(trigger: any, row) {
        this.SelectDuan = row
        this.triggerOrigin = trigger;
        this.isOpenDuan = !this.isOpenDuan
    }
    ChonDuan(item, id) {
        item.sid = id;
        this._congviecService.UpdateTasks(item, item.id).subscribe();
        this.isOpenDuan = false;
    }
    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
