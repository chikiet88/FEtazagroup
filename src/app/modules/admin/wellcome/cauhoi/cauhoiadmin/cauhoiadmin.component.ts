import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NhanvienService } from 'app/modules/admin/baocao/nhanvien/nhanvien.service';
import { Nhanvien } from 'app/modules/admin/baocao/nhanvien/nhanvien.type';
import { CauhinhService } from 'app/modules/admin/cauhinh/cauhinh.service';
import { Cauhinh } from 'app/modules/admin/cauhinh/cauhinh.types';
import { Subject, takeUntil } from 'rxjs';
import { CauhoiService } from '../cauhoi.service';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { MatDrawer } from '@angular/material/sidenav';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
@Component({
  selector: 'app-cauhoiadmin',
  templateUrl: './cauhoiadmin.component.html',
  styleUrls: ['./cauhoiadmin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CauhoiadminComponent implements OnInit {
  public Editor = InlineEditor;
  public config = {
    placeholder: 'Vui lòng nhập nội dung'
  };
  displayedColumns: string[] = ['#', 'Tieude', 'NoidungCauhoi', 'NoidungTraloi', 'Cauhoituongtu', 'Vitri', 'idTao', 'Trangthai'];
  dataSource: MatTableDataSource<any>;
  cauhois: any;
  Phongban: any;
  Khoi: any;
  Congty: any;
  Bophan: any;
  Vitri: any;
  thisUser: any;
  Nhanviens: any;
  Status: any;
  CauhoiForm: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;


  @ViewChild('PanelOrigin') private _PanelOrigin: ElementRef;
  @ViewChild('Panel') private _Panel: TemplateRef<any>;
  filteredTags: any[];
  private _PanelOverlayRef: OverlayRef;

  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private _cauhoiService: CauhoiService,
    private _cauhinhService: CauhinhService,
    private _nhanvienService: NhanvienService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,

    private _renderer2: Renderer2,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef
  ) { }
  ngOnInit(): void {
    this.CauhoiForm = this._formBuilder.group({
      Tieude: [''],
      NoidungCauhoi: [''],
      NoidungTraloi: [''],
      Cauhoituongtu: [''],
    })
    this.Status = [
      { id: 0, title: 'Chưa Xem' },
      { id: 1, title: 'Trùng Lặp' },
      { id: 2, title: 'Không Phù Hợp' },
      { id: 3, title: 'Xuất Bản' },
    ]
    this.filteredTags = this.Status;
    this._cauhoiService.hotros$.subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
    this._cauhinhService.Cauhinhs$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: Cauhinh[]) => {
        this.Phongban = data.find(v => v.id == "1eb67802-1257-4cc9-b5f6-5ebc3c3e8e4d").detail;
        this.Khoi = data.find(v => v.id == "295ec0c7-3d76-405b-80b9-7819ea52831d").detail;
        this.Congty = data.find(v => v.id == "bf076b63-3a2c-47e3-ab44-7f3c35944369").detail;
        this.Bophan = data.find(v => v.id == "d0694b90-6b8b-4d67-9528-1e9c315d815a").detail;
        this.Vitri = data.find(v => v.id == "ea424658-bc53-4222-b006-44dbbf4b5e8b").detail;
        this._changeDetectorRef.markForCheck();
      });
    this._nhanvienService.nhanviens$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: Nhanvien[]) => {
        this.Nhanviens = data;
        this._changeDetectorRef.markForCheck();
      });

  }

  openPanel(): void {
    this._PanelOverlayRef = this._overlay.create({
      backdropClass: '',
      hasBackdrop: true,
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay.position()
        .flexibleConnectedTo(this._PanelOrigin.nativeElement)
        .withFlexibleDimensions(true)
        .withViewportMargin(64)
        .withLockedPosition(true)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top'
          }
        ])
    });
    this._PanelOverlayRef.attachments().subscribe(() => {
      this._renderer2.addClass(this._PanelOrigin.nativeElement, 'panel-opened');
      this._PanelOverlayRef.overlayElement.querySelector('input').focus();
    });
    const templatePortal = new TemplatePortal(this._Panel, this._viewContainerRef);
    this._PanelOverlayRef.attach(templatePortal);
    this._PanelOverlayRef.backdropClick().subscribe(() => {
      this._renderer2.removeClass(this._PanelOrigin.nativeElement, 'panel-opened');
      if (this._PanelOverlayRef && this._PanelOverlayRef.hasAttached()) {
        this._PanelOverlayRef.detach();
        this.filteredTags = this.Status;
      }
      if (templatePortal && templatePortal.isAttached) {
        templatePortal.detach();
      }
    });
  }
  filterPanel(event): void {
    const value = event.target.value.toLowerCase();
    this.filteredTags = this.Status.filter(v => v.title.toLowerCase().includes(value));
  }
  filterTagsInputKeyDown(event): void {
    if (event.key !== 'Enter') {
      return;
    }
    if (this.filteredTags.length === 0) {
      this.createTag(event.target.value);
      event.target.value = '';
      return;
    }
    const tag = this.filteredTags[0];
    const isTagApplied = this.Status.find(id => id === tag.id);
    if (isTagApplied) {
      this.removeTagFromContact(tag);
    }
    else {
      this.addTagToContact(tag);
    }
  }
  addTagToContact(tag): void {
    // // Add the tag
    // this.contact.tags.unshift(tag.id);

    // // Update the contact form
    // this.contactForm.get('tags').patchValue(this.contact.tags);

    // // Mark for check
    // this._changeDetectorRef.markForCheck();
  }
  removeTagFromContact(tag): void {
    // // Remove the tag
    // this.contact.tags.splice(this.contact.tags.findIndex(item => item === tag.id), 1);

    // // Update the contact form
    // this.contactForm.get('tags').patchValue(this.contact.tags);

    // // Mark for check
    // this._changeDetectorRef.markForCheck();
  }
  toggleContactTag(tag): void {
    if ( this.Status.includes(tag.id) )
    {
        this.removeTagFromContact(tag);
    }
    else
    {
        this.addTagToContact(tag);
    }
  }
  updateTagTitle(tag, event): void {
    // // Update the title on the tag
    // tag.title = event.target.value;

    // // Update the tag on the server
    // this._contactsService.updateTag(tag.id, tag)
    //     .pipe(debounceTime(300))
    //     .subscribe();

    // this._changeDetectorRef.markForCheck();
  }
  createTag(title): void {
    const tag = {
      title
    };

    // Create tag on the server
    // this._contactsService.createTag(tag)
    //     .subscribe((response) => {

    //         // Add the tag to the contact
    //         this.addTagToContact(response);
    //     });
  }
  deleteTag(tag): void {
    // this._contactsService.deleteTag(tag.id).subscribe();
    this._changeDetectorRef.markForCheck();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  UpdateStatus(data, status) {
    console.log(data);
    data.Trangthai = status.id;
    this._cauhoiService.UpdateHotro(data.id, data).subscribe();
  }
  UpdateTraloi() {
    this.matDrawer.toggle();
    const data = this.CauhoiForm.getRawValue();
    this._cauhoiService.UpdateTraloi(data).subscribe(() => { this._changeDetectorRef.markForCheck(); }
    );
  }
  DeleteCauhoi(data) {
    this._cauhoiService.DeleteCauhoi(data).subscribe();
  }
  EditCauhoi(data) {
    this.CauhoiForm.addControl('id', new FormControl(''))
    this.CauhoiForm.patchValue(data);
    this.matDrawer.toggle();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
