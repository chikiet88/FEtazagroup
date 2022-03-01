import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Nhanvien } from '../nhanvien.type';
import { ListComponent } from '../list/list.component';
import { NhanvienService } from '../nhanvien.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    editMode: boolean = false;
    tagsEditMode: boolean = false;
    nhanvien: Nhanvien;
    contactForm: FormGroup;
    nhanviens: Nhanvien[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _ListComponent: ListComponent,
        private _nhanvienService: NhanvienService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
    )
    {
    }
    ngOnInit(): void
    {
        // Open the drawer
        this._ListComponent.matDrawer.open();

        this.contactForm = this._formBuilder.group({
            id          : [''],
            avatar      : [null],
            name        : ['', [Validators.required]],
            emails      : this._formBuilder.array([]),
            phoneNumbers: this._formBuilder.array([]),
            title       : [''],
            company     : [''],
            birthday    : [null],
            address     : [null],
            notes       : [null],
            tags        : [[]]
        });

        // Get the contacts
        this._nhanvienService.nhanviens$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((nhanviens: Nhanvien[]) => {
                this.nhanviens = nhanviens;
                console.log(this.nhanviens)
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        this._nhanvienService.nhanvien$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((nhanvien: Nhanvien) => {
                console.log(this.nhanvien)
                this._ListComponent.matDrawer.open();
                this.nhanvien = nhanvien;
                this.toggleEditMode(false);
                this._changeDetectorRef.markForCheck();
            });
    }
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if ( this._tagsPanelOverlayRef )
        {
            this._tagsPanelOverlayRef.dispose();
        }
    }
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._ListComponent.matDrawer.close();
    }
    toggleEditMode(editMode: boolean | null = null): void
    {
        if ( editMode === null )
        {
            this.editMode = !this.editMode;
        }
        else
        {
            this.editMode = editMode;
        }

        this._changeDetectorRef.markForCheck();
    }
    updateNhanvien(): void
    {
        const contact = this.contactForm.getRawValue();
        contact.emails = contact.emails.filter(email => email.email);
        contact.phoneNumbers = contact.phoneNumbers.filter(phoneNumber => phoneNumber.phoneNumber);
        this._nhanvienService.updateNhanvien(contact.id, contact).subscribe(() => {
            this.toggleEditMode(false);
        });
    }
    deleteNhanvien(): void
    {
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Xóa Nhân Viên',
            message: 'Bạn Thật Sự Muốn Xóa Nhân Viên',
            actions: {
                confirm: {
                    label: 'Xóa'
                }
            }
        });
        confirmation.afterClosed().subscribe((result) => {
            if ( result === 'confirmed' )
            {
                const id = this.nhanvien.id;
                const currentContactIndex = this.nhanviens.findIndex(item => item.id === id);
                const nextContactIndex = currentContactIndex + ((currentContactIndex === (this.nhanviens.length - 1)) ? -1 : 1);
                const nextContactId = (this.nhanviens.length === 1 && this.nhanviens[0].id === id) ? null : this.nhanviens[nextContactIndex].id;
                this._nhanvienService.deleteNhanvien(id)
                    .subscribe((isDeleted) => {
                        if ( !isDeleted )
                        {
                            return;
                        }
                        if ( nextContactId )
                        {
                            this._router.navigate(['../', nextContactId], {relativeTo: this._activatedRoute});
                        }
                        else
                        {
                            this._router.navigate(['../'], {relativeTo: this._activatedRoute});
                        }
                        this.toggleEditMode(false);
                    });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

    }
    // uploadAvatar(fileList: FileList): void
    // {
    //     // Return if canceled
    //     if ( !fileList.length )
    //     {
    //         return;
    //     }

    //     const allowedTypes = ['image/jpeg', 'image/png'];
    //     const file = fileList[0];

    //     // Return if the file is not allowed
    //     if ( !allowedTypes.includes(file.type) )
    //     {
    //         return;
    //     }

    //     // Upload the avatar
    //     this._contactsService.uploadAvatar(this.contact.id, file).subscribe();
    // }
    // removeAvatar(): void
    // {
    //     // Get the form control for 'avatar'
    //     const avatarFormControl = this.contactForm.get('avatar');

    //     // Set the avatar as null
    //     avatarFormControl.setValue(null);

    //     // Set the file input value as null
    //     this._avatarFileInput.nativeElement.value = null;

    //     // Update the contact
    //     this.contact.avatar = null;
    // }
    toggleTagsEditMode(): void
    {
        this.tagsEditMode = !this.tagsEditMode;
    }
    // filterTags(event): void
    // {
    //     const value = event.target.value.toLowerCase();
    //     this.filteredTags = this.tags.filter(tag => tag.title.toLowerCase().includes(value));
    // }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
