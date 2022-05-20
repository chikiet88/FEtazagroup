import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-duanaddlist',
  templateUrl: './duanaddlist.component.html',
  styleUrls: ['./duanaddlist.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DuanaddlistComponent implements OnInit
{
    @ViewChild('titleInput') titleInput: ElementRef;
    @Input() buttonTitle: string = 'Thêm Section';
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
        // Initialize the new list form
        this.form = this._formBuilder.group({
            title: ['']
        });
    }
    save(): void
    {
        const title = this.form.get('title').value;
        if ( !title || title.trim() === '' )
        {
            return;
        }
        this.saved.next(title.trim());
        this.form.get('title').setValue('');
        this.formVisible = false;
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
