import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NhanvienService } from 'app/modules/admin/baocao/nhanvien/nhanvien.service';
import { Nhanvien } from 'app/modules/admin/baocao/nhanvien/nhanvien.type';
import { CauhinhService } from 'app/modules/admin/cauhinh/cauhinh.service';
import { Cauhinh } from 'app/modules/admin/cauhinh/cauhinh.types';
import { BehaviorSubject, combineLatest, filter, Subject, takeUntil } from 'rxjs';
import { CauhoithuonggapService } from '../cauhoithuonggap.service';
import Editor from 'ckeditor5/build/ckEditor';
import { MatDrawer } from '@angular/material/sidenav';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { UserService } from 'app/core/user/user.service';
import { MatOption } from '@angular/material/core';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-admincauhoi',
  templateUrl: './admincauhoi.component.html',
  styleUrls: ['./admincauhoi.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdmincauhoiComponent implements OnInit {
  public Editor = Editor ;
  public config = {
    placeholder: 'Vui lòng nhập nội dung',
    link : {
      addTargetToExternalLinks: true
    }
  };
  displayedColumns: string[] = ['#', 'Danhmuc', 'NoidungCauhoi', 'NoidungTraloi', 'Cauhoituongtu', 'Vitri', 'idTao', 'Trangthai'];
  dataSource: MatTableDataSource<any>;
  Phongban: any;
  Khoi: any;
  Congty: any;
  Bophan: any;
  Vitri: any;
  filteredVitri: any;
  thisUser: any;
  Nhanviens: any;
  Status: any;
  CauhoiForm: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  @ViewChild('PanelOrigin') private _PanelOrigin: ElementRef;
  @ViewChild('Panel') private _Panel: TemplateRef<any>;
  Cauhois: any[];
  ThisCauhoi: any;
  Cauhoituongtu: any[];
  filteredCauhois: any[];
  PanelItem: any;
  CRUD: any;
  Title:any;
  isAddDM:boolean;
  Danhmucs: any[];
  filteredDanhmucs: any[];
  filters: {query$: BehaviorSubject<string>} = {query$ : new BehaviorSubject('')};
  private _PanelOverlayRef: OverlayRef;
  triggerOrigin:any;
  triggerType:any[];
  @ViewChild('TenDanhmuc') TenDanhmuc:ElementRef;
  @ViewChild('allSelected') private allSelected: MatOption;
  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private _cauhoiService: CauhoithuonggapService,
    private _cauhinhService: CauhinhService,
    private _nhanvienService: NhanvienService,
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _renderer2: Renderer2,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef
  ) { }
  ngOnInit(): void {
    this.triggerType = [];
    this.CRUD = 0;
    this.isAddDM = false;
    this.Title = "Thêm Mới";
    this.CauhoiForm = this._formBuilder.group({
      Danhmuc: [''],
      NoidungCauhoi: [''],
      NoidungTraloi: [''],
      Cauhoituongtu: [''],
      Vitri: [''],
      idTao: [''],
    })
    this.Status = [
      { id: 0, title: 'Chưa Xem' },
      { id: 1, title: 'Trùng Lặp' },
      { id: 2, title: 'Không Phù Hợp' },
      { id: 3, title: 'Xuất Bản' },
    ]

    this._cauhoiService.hotros$.subscribe((data) => {
      this.Cauhois = this.filteredCauhois = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this._changeDetectorRef.markForCheck();
    })
    this._cauhinhService.danhmucs$.subscribe((data) => {
      this.Danhmucs = data.filter(v=>v.Module == 1);
      this.filteredDanhmucs = this.Danhmucs;
      this._changeDetectorRef.markForCheck();
    })
    this._cauhinhService.Cauhinhs$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: Cauhinh[]) => {
        this.Phongban = data.find(v => v.id == "1eb67802-1257-4cc9-b5f6-5ebc3c3e8e4d").detail;
        this.Khoi = data.find(v => v.id == "295ec0c7-3d76-405b-80b9-7819ea52831d").detail;
        this.Congty = data.find(v => v.id == "bf076b63-3a2c-47e3-ab44-7f3c35944369").detail;
        this.Bophan = data.find(v => v.id == "d0694b90-6b8b-4d67-9528-1e9c315d815a").detail;
        this.Vitri = this.filteredVitri = Object.entries(data.find(v => v.id == "ea424658-bc53-4222-b006-44dbbf4b5e8b").detail).map(([id, value]) => ({id,value}));
        console.log(this.Vitri);
        
        this._changeDetectorRef.markForCheck();
      });
    this._nhanvienService.nhanviens$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: Nhanvien[]) => {
        this.Nhanviens = data;
        this._changeDetectorRef.markForCheck();
      });
  }
  // toggleAllSelection() {
  //   if (this.allSelected) {
  //     this.select.options.forEach((item: MatOption) => item.select());
  //   } else {
  //     this.select.options.forEach((item: MatOption) => item.deselect());
  //   }
  // }
  tosslePerOne(all){ 
    if (this.allSelected.selected) {  
     this.allSelected.deselect();
     return false;
    }
   if(Object.keys(this.CauhoiForm.controls.Vitri.value).length==Object.keys(this.Vitri).length)
     this.allSelected.select();
 }
  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.CauhoiForm.controls.Vitri
        .patchValue([...Object.keys(this.Vitri).map(item => item), 0]);
    } else {
      this.CauhoiForm.controls.Vitri.patchValue([]);
    }
  }
  // toggleAllSelection()
  // {
  //   this.CauhoiForm.get("Vitri").setValue(this.Vitri);
  //   //this.CauhoiForm.patchValue({Vitri: this.Vitri});
  //   console.log(this.CauhoiForm);
    
  // }
  openPanel(data): void {
    this.PanelItem = data;
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
        //this.filteredItems = data.Cauhoituongtu;
      }
      if (templatePortal && templatePortal.isAttached) {
        templatePortal.detach();
      }
    });
  }
  filterPanel(event): void {
    const value = event.target.value.toLowerCase();
    this.Cauhois = this.Status.filter(v => v.title.toLowerCase().includes(value));
  }
  CreateDanhMuc(data)
  {
    const danhmuc = {'Tieude':data.value};
    this._cauhinhService.CreateDanhmuc(danhmuc).subscribe();
    this.TenDanhmuc.nativeElement.value  = "";
    this.isAddDM =false;
  }
  addItem(data, item): void {
    data.Cauhoituongtu.push(item.id);
    this._cauhoiService.UpdateTraloi(data).subscribe();
    this._changeDetectorRef.markForCheck();
  }
  removeItem(data, item): void {
    data.Cauhoituongtu = data.Cauhoituongtu.filter(v => v != item.id);
    this._cauhoiService.UpdateTraloi(data).subscribe();
    this._changeDetectorRef.markForCheck();
  }
  toggleItem(data, item): void {
    if (data.Cauhoituongtu.includes(item.id)) {

      this.removeItem(data, item);
    }
    else {
      this.addItem(data, item);
    }
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
    this._cauhoiService.UpdateTraloi(data).subscribe();
    this._changeDetectorRef.markForCheck();
  }
  ChangeValue(item,type,value) {
    item[type]=value;
    this._cauhoiService.UpdateTraloi(item).subscribe();
    this._changeDetectorRef.markForCheck();
    this.triggerType[type] = false;
  }
  AddValue(item,type,value) {
    item[type].push(value);
    this._cauhoiService.UpdateTraloi(item).subscribe();
    this._changeDetectorRef.markForCheck();
    this.triggerType[type] = false;
  }
  RemoveValue(item,type,value) {
    console.log(item[type]);
    console.log(value);
    item[type] = item[type].filter(v=>v!=value);
    this._cauhoiService.UpdateTraloi(item).subscribe();
    this._changeDetectorRef.markForCheck();
    this.triggerType[type] = false;
  }
  ChangeEditorValue(item,type,{editor}: ChangeEvent ) {   
    if(editor.getData()!=undefined)
    {
    item[type] =editor.getData();
    this._cauhoiService.UpdateTraloi(item).subscribe();
    this._changeDetectorRef.markForCheck();
    }
}
  CreateTraloi() {
    this.matDrawer.toggle();
    const data = this.CauhoiForm.getRawValue();    
    this._cauhoiService.CreateHotro(data).subscribe();
    this._changeDetectorRef.markForCheck();
  }
  DeleteCauhoi(data) {
    this._cauhoiService.DeleteCauhoi(data).subscribe();
  }
  EditCauhoi(data) {
    this.ThisCauhoi = data;
    this.CRUD = 1;
    this.Title = "Cập Nhật";
    this.CauhoiForm.addControl('id', new FormControl(''))
    this.CauhoiForm.patchValue(data);
  }
  AddCauhoi() {
    this.CRUD = 0;
    this.Title = "Thêm Mới";
    this.CauhoiForm = this._formBuilder.group({
      Danhmuc: [''],
      NoidungCauhoi: [''],
      NoidungTraloi: [''],
      Cauhoituongtu: [''],
      Vitri: [''],
      idTao: [this.thisUser.id],
    })
    this.matDrawer.toggle();

  }
  filterDanhmuc(event): void
  {
    const value = event.target.value.toLowerCase();
    this.filteredDanhmucs = this.Danhmucs.filter(v => v.name.toLowerCase().includes(value));
  }
  AllCauhois()
  {
    this.filteredCauhois = this.Cauhois;
  }
  filterCauhoi(event): void
  {
    const value = event.target.value.toLowerCase();
    this.filteredCauhois = this.Cauhois.filter(v=>v.NoidungCauhoi.toLowerCase().includes(value))  
  }
  filterTTCauhoi(value): void
  {
    this.filteredCauhois = this.Cauhois.filter(v=>v.Trangthai == value)  
  }
  filterVitri(event): void
  {
    const value = event.target.value.toLowerCase();
    console.log(value);
    this.filteredVitri = this.Vitri.filter(v => v.value.toLowerCase().includes(value));
  }
  ngOnDestroy(): void
  {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  toggleOverlay(trigger: any,type) {   
    this.triggerOrigin = trigger;
    this.triggerType[type] = !this.triggerType[type]    
  }
}
