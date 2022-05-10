import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    @Output() readonly saved: EventEmitter<string> = new EventEmitter<string>();
    form: FormGroup;
    formVisible: boolean = false;
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder
    )
    {

    }
    ngOnInit(): void
    {
        this.form = this._formBuilder.group({
            title: ['']
        });
    }
    CreateTask(gid): void
    {
      const task = { Tieude: "New Task", sid: idSection, idTao: this.CUser.id }
      const checktask = this.Tasks.filter(v => v.sid == idSection);
      if (checktask.length != 0 && checktask[0].Tieude == "New Task") {
        this._notifierService.notify('error', 'Có Task Mới Chưa Đổi Tên');
      }
      else {
        this._quanlycongviecService.CreateTasks(task).subscribe();
      }
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
