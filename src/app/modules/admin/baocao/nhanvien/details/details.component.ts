import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Nhanvien } from '../nhanvien.type';
import { ListComponent } from '../list/list.component';
import { NhanvienService } from '../nhanvien.service';
import { Cauhinh } from 'app/modules/admin/cauhinh/cauhinh.types';
import { CauhinhService } from 'app/modules/admin/cauhinh/cauhinh.service';

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
    tagsEditMode: boolean = false;
    nhanvien: Nhanvien;
    NhanvienForm: FormGroup;
    nhanviens: Nhanvien[];
    Phongban: object;
    Khoi: object;
    Congty: object;
    Bophan: object;
    Vitri: object;
    Chinhanh: object;
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    cauhinh:Cauhinh[];
    Cauhinhs$:Observable<Cauhinh[]>;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _ListComponent: ListComponent,
        private _nhanvienService: NhanvienService,
        private _cauhinhService: CauhinhService,
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
       this._cauhinhService.Cauhinhs$
       .pipe(takeUntil(this._unsubscribeAll))
       .subscribe((data: Cauhinh[]) => {
            this.Phongban = data.find(v=>v.id =="1eb67802-1257-4cc9-b5f6-5ebc3c3e8e4d").detail;
            this.Khoi = data.find(v=>v.id =="295ec0c7-3d76-405b-80b9-7819ea52831d").detail;
            this.Congty = data.find(v=>v.id =="bf076b63-3a2c-47e3-ab44-7f3c35944369").detail;
            this.Bophan = data.find(v=>v.id =="d0694b90-6b8b-4d67-9528-1e9c315d815a").detail;
            this.Vitri = data.find(v=>v.id =="ea424658-bc53-4222-b006-44dbbf4b5e8b").detail;
            this.Chinhanh = data.find(v=>v.id =="6e2ea777-f6e8-4738-854b-85e60655f335").detail;
           this._changeDetectorRef.markForCheck();
       });
        this._ListComponent.matDrawer.open();
        this.NhanvienForm = this._formBuilder.group({
            id      : [''],
            avatar      : [null],
            name        : ['', [Validators.required]],
            email       : ['', [Validators.required]],
            SDT         : ['', [Validators.required]],
            Role         : [''],
            Phanquyen       : this._formBuilder.group({
                Chinhanh: [''],
            }),
            profile: this._formBuilder.group({
                Congty: [''],
                Khoi: [''],
                Phongban: [''],
                Bophan: [''],
                Vitri: [''],
                TTLV: [''],
                MaNV: [''],
                CMND: [''],
                Datein: [''],
                Dateout: [''],
                Diachi: [''],
                Fb: [''],
                Gioitinh: [''],
                Ngaysinh: [''],
                PQDT: [''],
                PQTD: [''],
                Zalo: [''],
              }),    
        });

        // Get the contacts
        this._nhanvienService.nhanviens$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((nhanviens: Nhanvien[]) => {
                this.nhanviens = nhanviens;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        this._nhanvienService.nhanvien$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((nhanvien: Nhanvien) => {
                console.log(nhanvien);
                this.NhanvienForm.patchValue({
                    id: nhanvien.id,
                    avatar: nhanvien.avatar,
                    name: nhanvien.name,
                    email: nhanvien.email,
                    SDT: nhanvien.SDT,
                    Role: nhanvien.Role,
                    Phanquyen: 
                    {
                        Chinhanh: nhanvien.Phanquyen.Chinhanh,
                    },
                    profile: {
                        Congty: nhanvien.profile.Congty,
                        Khoi: nhanvien.profile.Khoi,
                        Phongban: nhanvien.profile.Phongban,
                        Bophan: nhanvien.profile.Bophan,
                        Vitri: nhanvien.profile.Vitri,
                        TTLV: nhanvien.profile.TTLV,
                        MaNV: nhanvien.profile.MaNV,
                        CMND: nhanvien.profile.CMND,
                        Datein: nhanvien.profile.Datein,
                        Dateout: nhanvien.profile.Dateout,
                        Diachi: nhanvien.profile.Diachi,
                        Fb: nhanvien.profile.Fb,
                        Gioitinh: nhanvien.profile.Gioitinh,
                        Ngaysinh: nhanvien.profile.Ngaysinh,
                        PQDT: nhanvien.profile.PQDT,
                        PQTD: nhanvien.profile.PQTD,
                        Zalo: nhanvien.profile.Zalo,
                    }
                  });
                this._ListComponent.matDrawer.open();
                this.nhanvien = nhanvien;
                this._changeDetectorRef.markForCheck();
            });
            this.NhanvienForm.disable();

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
    editNhanvien() {
        this.NhanvienForm.enable();
        this._changeDetectorRef.markForCheck();
    }
    Cancel() {
        this.NhanvienForm.disable();
        this._changeDetectorRef.markForCheck();
    }
    updateNhanvien(): void
    {
        const contact = this.NhanvienForm.getRawValue();
            console.log(contact);
        this._nhanvienService.updateNhanvien(contact.id, contact).subscribe(() => {
            this.NhanvienForm.disable();
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
                        this.editNhanvien();
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
