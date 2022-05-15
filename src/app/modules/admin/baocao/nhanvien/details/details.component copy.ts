import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { catchError, debounceTime, Observable, Subject, takeUntil, throwError } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Nhanvien, profile } from '../nhanvien.type';
import { ListComponent } from '../list/list.component';
import { NhanvienService } from '../nhanvien.service';
import { Cauhinh } from 'app/modules/admin/cauhinh/cauhinh.types';
import { CauhinhService } from 'app/modules/admin/cauhinh/cauhinh.service';
import { cloneDeep } from 'lodash';
import { MAT_DATE_FORMATS } from '@angular/material/core';
export const MY_DATE_FORMATS = {
    parse: {
      dateInput: 'DD/MM/YYYY',
    },
    display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    },
};
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
      ]
})
export class DetailsComponent implements OnInit, OnDestroy
{
    panelOpenState = false;
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;
    tagsEditMode: boolean = false;
    nhanvien: Nhanvien;
    NhanvienForm: FormGroup;
    nhanviens: Nhanvien[];
    profile: profile;
    Phongban: object;
    Khoi: object;
    Congty: object;
    Bophan: object;
    Vitri: object;
    Chinhanh: object;
    PQChinhanh:any;
    PQMenu:any;
    Menu:any;
    PQisDisabled:boolean;
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
        private _router: Router,
    )
    {}
    ngOnInit(): void
    {
       this.PQisDisabled = true;
       this._cauhinhService.Cauhinhs$
       .pipe(takeUntil(this._unsubscribeAll))
       .subscribe((data: Cauhinh[]) => {
            this.Phongban = data.find(v=>v.id =="1eb67802-1257-4cc9-b5f6-5ebc3c3e8e4d").detail;
            this.Khoi = data.find(v=>v.id =="295ec0c7-3d76-405b-80b9-7819ea52831d").detail;
            this.Congty = data.find(v=>v.id =="bf076b63-3a2c-47e3-ab44-7f3c35944369").detail;
            this.Bophan = data.find(v=>v.id =="d0694b90-6b8b-4d67-9528-1e9c315d815a").detail;
            this.Vitri = data.find(v=>v.id =="ea424658-bc53-4222-b006-44dbbf4b5e8b").detail;
            this.Chinhanh = data.find(v=>v.id =="6e2ea777-f6e8-4738-854b-85e60655f335").detail;
            this.PQChinhanh = cloneDeep(this.Chinhanh);
            Object.keys(this.PQChinhanh).forEach(key => {
                this.PQChinhanh[key] = false;
              });
           this._changeDetectorRef.markForCheck();
       });
       this._cauhinhService.Menus$
       .pipe(takeUntil(this._unsubscribeAll))
       .subscribe((data) => {
           console.log(data);
            this.Menu = data;
            this.PQMenu = {};
            data.forEach(v => {
                this.PQMenu[v.uuid]=v.status;
              });
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
            Phanquyen       : [''],
            Menu       : [''],
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
        this._nhanvienService.nhanvien$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((nhanvien: Nhanvien) => {
        this.nhanvien = nhanvien;
        this._nhanvienService.getProfileById(nhanvien.id).subscribe();
        this._nhanvienService.profile$.subscribe((profile: profile) => {               
            this.profile = profile;
            console.log(this.profile);
            this.PQChinhanh= Object.assign(this.PQChinhanh,nhanvien.Phanquyen); 
            this.PQMenu= nhanvien.Menu; 
              this.NhanvienForm.patchValue({
                  id: nhanvien.id,
                  avatar: nhanvien.avatar,
                  name: nhanvien.name,
                  email: nhanvien.email,
                  SDT: nhanvien.SDT,
                  Role: nhanvien.Role,
                  Phanquyen: nhanvien.Phanquyen,
                  Menu: nhanvien.Menu,
                  profile: {
                      Congty: this.profile.Congty,
                      Khoi: this.profile.Khoi,
                      Phongban: this.profile.Phongban,
                      Vitri: this.profile.Vitri,
                      MaNV: this.profile.MaNV,
                      CMND: this.profile.CMND,
                      Ngayvao: this.profile.Ngayvao,
                      Ngaynghi: this.profile.Ngaynghi,
                      Diachi: this.profile.Diachi,
                      Facebook: this.profile.Facebook,
                      Ngaysinh: this.profile.Ngaysinh,
                      Zalo: this.profile.Zalo,
                      Trangthai: this.profile.Trangthai,
                  }
                });

            this._changeDetectorRef.markForCheck();
        });
            this._ListComponent.matDrawer.open();
            this._changeDetectorRef.markForCheck();
        });  

        this.NhanvienForm.disable();
        this.PQisDisabled = true;

    }
    ChangeChinhanh(Chinhanh: string, isChecked: any) {
        this.PQChinhanh[Chinhanh]=isChecked.checked;
        this.NhanvienForm.get('Phanquyen').setValue(this.PQChinhanh);
      }
   ChangeAllChinhanh(isChecked: any) {
       Object.keys(this.PQChinhanh).forEach(key => {
        this.PQChinhanh[key] = isChecked.checked;
      });
      this.NhanvienForm.get('Phanquyen').setValue(this.PQChinhanh);
    }
   ChangeMenu(Menu: string, isChecked: any) {
        this.PQMenu[Menu]=isChecked.checked;
        this.NhanvienForm.get('Menu').setValue(this.PQMenu);
      }     
   ChangeAllMenu(isChecked: any) {
       Object.keys(this.PQMenu).forEach(key => {
        this.PQMenu[key] = isChecked.checked;
      });
      this.NhanvienForm.get('Menu').setValue(this.PQMenu);
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
        this.PQisDisabled = false;
        this.NhanvienForm.enable();
        this._changeDetectorRef.markForCheck();
    }
    Cancel() {
        this.NhanvienForm.disable();
        this.PQisDisabled = true;
        this._changeDetectorRef.markForCheck();
    }
    updateNhanvien(): void
    {
        const contact = this.NhanvienForm.getRawValue();
        this._nhanvienService.updateNhanvien(contact.id, contact).subscribe(() => {
         this.NhanvienForm.disable();
         this.PQisDisabled = true;
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
