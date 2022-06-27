import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'app/core/user/user.types';;
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { QuanlycongviecService } from '../../../quanlycongviec/quanlycongviec.service';
@Component({
  selector: 'app-addcard',
  templateUrl: './addcard.component.html',
  styleUrls: ['./addcard.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddcardComponent implements OnInit {
    @ViewChild('titleInput') titleInput: ElementRef;
    @ViewChild('titleAutosize') titleAutosize: CdkTextareaAutosize;
    @Input() buttonTitle: string = 'Thêm Mới';
    form: FormGroup;
    formVisible: boolean = false;
    CUser:any
    @Output() readonly saved: EventEmitter<string> = new EventEmitter<string>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _quanlycongviecService: QuanlycongviecService,
        private _userService: UserService,
    )
    {

    }
    ngOnInit(): void
    {
        this._userService.user$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data) => {
          this.CUser = data;
          this._changeDetectorRef.markForCheck();         
        });  
        this.form = this._formBuilder.group({
            title: ['']
        });
    }

    // CreateTask(gid): void
    // {
    //     console.log(gid); 
    //     const title = this.form.get('title').value;  
    //     if ( !title || title.trim() === '' )
    //     {
    //         return;
    //     }  
    //   const task = { Tieude: this.form.get('title').value, gid: gid, idTao: this.CUser.id }
    //   this._quanlycongviecService.CreateTasks(task).subscribe();
    //     this.formVisible = false;
    //     this.form.get('title').setValue('');
    //     setTimeout(() => {
    //         this.titleInput.nativeElement.value = '';
    //         this.titleAutosize.reset();
    //     });
    //     this._changeDetectorRef.markForCheck();
    // }

    save(): void
    {
        const title = this.form.get('title').value;
        if ( !title || title.trim() === '' )
        {
            return;
        }
        this.saved.next(title.trim());
        this.formVisible = false;
        this.form.get('title').setValue('');
        setTimeout(() => {
            this.titleInput.nativeElement.value = '';
            this.titleAutosize.reset();
        });

        this._changeDetectorRef.markForCheck();
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
