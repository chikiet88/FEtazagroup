import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { Vetuyendung} from '../vetuyendung.types';
import { VetuyendungService } from '../vetuyendung.service';
import { MatDrawer } from '@angular/material/sidenav';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, NumberValueAccessor } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Nhanvien } from 'app/modules/admin/baocao/nhanvien/nhanvien.type';
import { NhanvienService } from 'app/modules/admin/baocao/nhanvien/nhanvien.service';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { Cauhinh } from 'app/modules/admin/cauhinh/cauhinh.types';
import { CauhinhService } from 'app/modules/admin/cauhinh/cauhinh.service';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListComponent implements OnInit {
  public Editor = InlineEditor;
  public config = {
    placeholder: 'Vui lòng nhập ghi chú'
  };
  selectedVetuyendung: Vetuyendung;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  vetuyendungs$: Observable<Vetuyendung[]>;
  vetuyendungs: Vetuyendung[];
  VeTDForm:FormGroup;
  lists:any;
  vetuyendungsCount: number = 0;
  drawerMode: 'over' | 'side';
  searchInputControl: FormControl = new FormControl();
  Title:string;
  CRUD:Number;
  Lydotuyen:any;
  Nguoipheduyet:any;
  NguoipheduyetEditMode:any;
  filteredNguoipheduyet: any;
  Nhanvien: Nhanvien[];
  Phongban: any;
  Khoi: any;
  Congty: any;
  Bophan: any;
  Vitri: any;
  private _PanelOverlayRef: OverlayRef;
  private readonly _positionStep: number = 65536;
  private readonly _maxListCount: number = 200;
  private readonly _maxPosition: number = this._positionStep * 500;
  constructor(    

    @Inject(DOCUMENT) private _document: any,   
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _VetuyendungService: VetuyendungService,
    private _NhanvienService: NhanvienService,
    private _CauhinhService: CauhinhService,
    private readonly notifier: NotifierService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formbuilder:FormBuilder,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _notificationsService: NotificationsService,
    private router:Router,
    ) { }
    @ViewChild('drawer', { static: true }) drawer: MatDrawer;
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    @ViewChild('PanelOrigin') private _PanelOrigin: ElementRef;
    @ViewChild('Panel') private _Panel: TemplateRef<any>;
    ngOnInit(): void
    {
        this.Nguoipheduyet = [];
        this.CRUD = 1;
        this.Title = 'Thêm Mới';
        this.VeTDForm = this._formbuilder.group({
                Vitri:[''],
                Thoigianthuviec:[''],
                Lydotuyen:[''],
                Nhansuhienco:[''],
                Nhansucantuyen:[''],
                Mucluongdukien:[''],
                Tongthunhap:[''],
                Nguoipheduyet:[''],
                Ghichu:[''],
        })
        this._NhanvienService.nhanviens$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((nhanvien: Nhanvien[]) => {
          console.log(nhanvien);
          this.Nhanvien = nhanvien;
          this.filteredNguoipheduyet = nhanvien; 
          this._changeDetectorRef.markForCheck();
        });
        //this.Lydotuyen = {'1':'Tuyển Mới','2':'Thay Thế','3':'Dự Phòng','4':'Khác'};
        this.lists = [
            {id : '1',title:'Bước 1',mota:'Tạo Phiếu Tuyển Dụng',vetd:[]},
            {id : '2',title:'Bước 2',mota:'Duyệt phiếu tuyển dụng',vetd:[]},
            {id : '3',title:'Bước 3',mota:'Tiếp nhận tuyển dụng',vetd:[]},
            {id : '4',title:'Bước 4',mota:'Phê duyệt phiếu',vetd:[]},
            {id : '5',title:'Bước 5',mota:'Triển khai tuyển dụng',vetd:[]},
            {id : '6',title:'Bước 6',mota:'Phê duyệt tuyển dụng',vetd:[]},
            {id : '7',title:'Bước 7',mota:'Xác nhận thanh toán',vetd:[]},
            {id : '8',title:'Bước 8',mota:'Thực hiện tuyển dụng',vetd:[]},
        ]

        this._CauhinhService.Cauhinhs$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Cauhinh[]) => {
          this.Phongban = data.find(v => v.id == "1eb67802-1257-4cc9-b5f6-5ebc3c3e8e4d").detail;
          this.Khoi = data.find(v => v.id == "295ec0c7-3d76-405b-80b9-7819ea52831d").detail;
          this.Congty = data.find(v => v.id == "bf076b63-3a2c-47e3-ab44-7f3c35944369").detail;
          this.Bophan = data.find(v => v.id == "d0694b90-6b8b-4d67-9528-1e9c315d815a").detail;
          this.Vitri = data.find(v => v.id == "ea424658-bc53-4222-b006-44dbbf4b5e8b").detail;
          this.Lydotuyen = data.find(v => v.id == "a2e90816-3c92-497e-a971-a8a62563de37").detail;
          this._changeDetectorRef.markForCheck();
        });
       // this.Vitri = {"eceb6560-47b2-480f-b876-857e48f7d723":"CEO","4aebb23f-0009-4765-8616-2ec0bc3bf721":"Front End","d9dfcd17-3bdb-4ef7-9675-336e33d0592b":"SEO","30941412-66c5-4676-8862-7de27aa86c85":"Leader IT"};
        this.vetuyendungs$ = this._VetuyendungService.vetuyendungs$;
        this._VetuyendungService.vetuyendungs$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((vetuyendungs: Vetuyendung[]) => {
                console.log(vetuyendungs)
                vetuyendungs.forEach(v => {
                    this.lists.find(v1 => v1.id == v.Step).vetd.push(v);
                   // this.lists[v.Step-1].vetd.push(v)
                });
                console.log(vetuyendungs)
                this.vetuyendungsCount = vetuyendungs.length;
                this.vetuyendungs = vetuyendungs;
                this._changeDetectorRef.markForCheck();
            });

            // this.matDrawer.openedChange.subscribe((opened) => {
            //     if ( !opened )
            //     {
            //         this.selectedVetuyendung = null;
            //         this._changeDetectorRef.markForCheck();
            //     }
            // });            
            this._fuseMediaWatcherService.onMediaChange$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(({matchingAliases}) => {
                    if ( matchingAliases.includes('lg') )
                    {
                        this.drawerMode = 'side';
                    }
                    else
                    {
                        this.drawerMode = 'over';
                    }
        
                    this._changeDetectorRef.markForCheck();
                });

    }
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        if ( this._PanelOverlayRef )
        {
            this._PanelOverlayRef.dispose();
        }
    }
    filterNguoipheduyet(event): void
    {
      const value = event.target.value.toLowerCase();
       this.filteredNguoipheduyet = this.Nhanvien.filter(item => item.name.toLowerCase().includes(value));
    }  
    toggleNguoipheduyetEditMode(): void
    {
       this.NguoipheduyetEditMode = !this.NguoipheduyetEditMode;
    }
    toggleNguoipheduyet(item): void
    {
        console.log(item);
        
        if ( this.Nguoipheduyet.includes(item.id))
        {
            this.deleteNguoipheduyet(item);
        }
        else
        {
            this.addNguoipheduyet(item);
        }
    }
    addNguoipheduyet(item): void
    {
        this.Nguoipheduyet.unshift(item.id);
        this.VeTDForm.get('Nguoipheduyet').patchValue(this.Nguoipheduyet);
        this._changeDetectorRef.markForCheck();
    }
    deleteNguoipheduyet(item): void
    {
        this.Nguoipheduyet.splice(this.Nguoipheduyet.findIndex(item => item === item.id), 1);
        this.VeTDForm.get('Nguoipheduyet').patchValue(this.Nguoipheduyet);
        this._changeDetectorRef.markForCheck();
    }
    openPanel(): void
    {
        this._PanelOverlayRef = this._overlay.create({
            backdropClass   : '',
            hasBackdrop     : true,
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                                  .flexibleConnectedTo(this._PanelOrigin.nativeElement)
                                  .withFlexibleDimensions(true)
                                  .withViewportMargin(64)
                                  .withLockedPosition(true)
                                  .withPositions([
                                      {
                                          originX : 'start',
                                          originY : 'bottom',
                                          overlayX: 'start',
                                          overlayY: 'top'
                                      }
                                  ])
        });
        this._PanelOverlayRef.attachments().subscribe(() => {
            this._PanelOverlayRef.overlayElement.querySelector('input').focus();
        });
        const templatePortal = new TemplatePortal(this._Panel, this._viewContainerRef);
        this._PanelOverlayRef.attach(templatePortal);
        this._PanelOverlayRef.backdropClick().subscribe(() => {
         if ( this._PanelOverlayRef && this._PanelOverlayRef.hasAttached() )
            {
                this._PanelOverlayRef.detach();
                this.NguoipheduyetEditMode = false;
            }
            if ( templatePortal && templatePortal.isAttached )
            {
                templatePortal.detach();
            }
        });
    }
    onBackdropClicked(): void
    {
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});
        this._changeDetectorRef.markForCheck();
    }
    editPhieutuyendung(vetuyendung): void
    {
        this.CRUD =2;
        this.Title = "Cập Nhật";
        this.VeTDForm.patchValue(vetuyendung);
        this.drawer.toggle()
        this._changeDetectorRef.markForCheck();
    }
    CreateVetuyerndung(): void
    {
        this.VeTDForm.addControl('Step', new FormControl(1));
        const Vetuyendung = this.VeTDForm.getRawValue();
        console.log(Vetuyendung);
        this._VetuyendungService.createVetuyendung(Vetuyendung).subscribe(
          (result) => {
              console.log(result);
              
            // Vetuyendung.Nguoipheduyet.forEach(v => {
            //   const notifi = {
            //     idFrom: result.idTao,
            //     idTo: v,
            //     Tieude: "Tuyển Dụng",
            //     Noidung: "Tạo Mới",
            //     Lienket: `${this.router.url}/${result.id}`,
            //   };
            //   this._notificationsService.create(notifi).subscribe();
            // });
            this._VetuyendungService.getVetuyendungs().subscribe();
            this.notifier.notify('success', `Tạo Mới Thành Công`);
            this.drawer.toggle();
            this._changeDetectorRef.markForCheck();
          });

    // if(this.vetuyendungs.length==0)
    //    { this._VetuyendungService.createVetuyendung().subscribe((newVe) => {
    //         this._router.navigate(['./', newVe.id], {relativeTo: this._activatedRoute});
    //         this._changeDetectorRef.markForCheck();
    //      });
    // }
    // else
    // {
    //     const idVitri = this.vetuyendungs[0].idVitri;
    //  if(!idVitri)
    //     {
    //         this._notifierService.notify('error', 'Có Phiếu Mới Chưa Điền');
            
    //     }
    //     else {
    //         this._VetuyendungService.createVetuyendung().subscribe((newVe) => {
    //             this._router.navigate(['./', newVe.id], {relativeTo: this._activatedRoute});
    //             this._changeDetectorRef.markForCheck();
    //     });   
    //     }
    // }

    }   
    
    VetuyendungDropped(event: CdkDragDrop<any[]>): void
    {
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Phê Duyệt Phiếu',
            message: 'Chắc Chắn Phê Duyệt',
            actions: {
                confirm: {
                    label: 'Phê Duyệt'
                }
            }
        });
        confirmation.afterClosed().subscribe((result) => {
            if ( result === 'confirmed' )
            {
                if ( event.previousContainer === event.container )
                {
                    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
                }
                else
                {
                    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
                    event.container.data[event.currentIndex].listId = event.container.id;
                }
                // Delete the list
              //  this._scrumboardService.deleteList(id).subscribe();
            }
        });
       // const updated = this._calculatePositions(event);
        //this._scrumboardService.updateCards(updated).subscribe();
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
