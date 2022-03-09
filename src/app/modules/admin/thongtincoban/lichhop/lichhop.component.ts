import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  ViewEncapsulation,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter,
  CalendarView,
} from 'angular-calendar';
import { FuseDrawerService } from '@fuse/components/drawer';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cauhinh } from '../../cauhinh/cauhinh.types';
import { CauhinhService } from '../../cauhinh/cauhinh.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { MatSidenav } from '@angular/material/sidenav';
import { LichhopService } from './lichhop.service';
import { NhanvienService } from '../../baocao/nhanvien/nhanvien.service';
import { Nhanvien } from '../../baocao/nhanvien/nhanvien.type';
import { user } from 'app/mock-api/common/user/data';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Lichhop } from './lichhop.type';
import { CustomEventTitleFormatter } from './custom-event-title-formatter.provider';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NotifierService } from 'angular-notifier';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
@Component({
  selector: 'app-lichhop',
  templateUrl: './lichhop.component.html',
  styleUrls: ['./lichhop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
})
export class LichhopComponent implements OnInit {
  public Editor = InlineEditor;
  public config = {
    placeholder: 'Vui lòng nhập nội dung'
  };
  //   public onReady( editor ) {
  //     editor.ui.getEditableElement().parentElement.insertBefore(
  //         editor.ui.view.toolbar.element,
  //         editor.ui.getEditableElement()
  //     );
  // }
  @ViewChild('picker') picker: any;
  @ViewChild('sidenav') sidenav: MatSidenav;
  public date: moment.Moment;
  public is_disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate: moment.Moment;
  public maxDate: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public stepHours = [1, 2, 3, 4, 5];
  public stepMinutes = [1, 5, 10, 15, 20, 25];
  public stepSeconds = [1, 5, 10, 15, 20, 25];
  view: CalendarView = CalendarView.Month;
  locale: string = 'vi';
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  // modalData: {
  //   action: string;
  //   event: CalendarEvent;
  // };
  // actions: CalendarEventAction[] = [
  //   {
  //     label: '<i class="fas fa-fw fa-pencil-alt"></i>',
  //     a11yLabel: 'Edit',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       this.handleEvent('Edited', event);
  //     },
  //   },
  //   {
  //     label: '<i class="fas fa-fw fa-trash-alt"></i>',
  //     a11yLabel: 'Delete',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       this.events = this.events.filter((iEvent) => iEvent !== event);
  //       this.handleEvent('Deleted', event);
  //     },
  //   },
  // ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  LichhopForm: FormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  Phongban: object;
  Nhanvien: Nhanvien[];
  Lichhops: Lichhop[];
  Lichhop: Lichhop;
  Khoi: object;
  Congty: object;
  Bophan: object;
  Vitri: object;
  Loaihinhhop: object;
  Title: string;
  user: any;
  CRUD: any;
  constructor(
    private _fuseDrawerService: FuseDrawerService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _CauhinhService: CauhinhService,
    private _NhanvienService: NhanvienService,
    private _UserService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _lichhopService: LichhopService,
    private _fuseConfirmationService: FuseConfirmationService,
    private readonly notifier: NotifierService,
  ) { }
  options: string[] = ['One', 'Two', 'Three'];
  @ViewChild('tabGroup', { static: false }) public tabGroup: any;
  public activeTabIndex: number | undefined = undefined;

  public handleTabChange(e: MatTabChangeEvent) {
    this.activeTabIndex = e.index;
  }

  // public ngAfterViewInit() {
  //   this.activeTabIndex = this.tabGroup.selectedIndex;
  // }
  toggle() {
    //this.sidenav.toggle();
  }
  Opentoggle() {
    this.LichhopForm = this._formBuilder.group({
      id: [''],
      Loaihinh: [{ value: '', disabled: this.is_disabled }],
      Tieude: [{ value: '', disabled: this.is_disabled }],
      Congty: [''],
      Chutri: [{ value: this.user.id, disabled: true }],
      Thamgia: [''],
      Ngansach: [''],
      Batdau: [''],
      Ketthuc: [''],
      Review: [''],
      Hoanthanh: [''],
      Noidung: [''],
      Trienkhai: [''],
      Ketqua: [''],
      Mongdoi: [''],
      Dieuchinh: [''],
      Dieukienkhac: [''],
      Nguyennhan: [''],
    });
    this.sidenav.toggle();
  }
  ngOnInit(): void {
    this.activeTabIndex = 0;
    this.Title = "Thêm Mới";
    this.CRUD = 1;
    this._NhanvienService.nhanviens$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((nhanvien: Nhanvien[]) => {
       // console.log(nhanvien);
        this.Nhanvien = nhanvien;
        this._changeDetectorRef.markForCheck();
      });
    this._CauhinhService.Cauhinhs$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: Cauhinh[]) => {
        this.Phongban = data.find(v => v.id == "1eb67802-1257-4cc9-b5f6-5ebc3c3e8e4d").detail;
        this.Khoi = data.find(v => v.id == "295ec0c7-3d76-405b-80b9-7819ea52831d").detail;
        this.Congty = data.find(v => v.id == "bf076b63-3a2c-47e3-ab44-7f3c35944369").detail;
        this.Bophan = data.find(v => v.id == "d0694b90-6b8b-4d67-9528-1e9c315d815a").detail;
        this.Vitri = data.find(v => v.id == "ea424658-bc53-4222-b006-44dbbf4b5e8b").detail;
        this.Loaihinhhop = data.find(v => v.id == "6b72e969-aefe-4a67-902f-4948929f3b01").detail;
        this._changeDetectorRef.markForCheck();
      });

    this._UserService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: User) => {
        this.user = data;
        this._changeDetectorRef.markForCheck();
      });

    this._lichhopService.lichhops$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((lichhops: Lichhop[]) => {
        this.Lichhops = lichhops;
        this._changeDetectorRef.markForCheck();
      });
    this._lichhopService.events$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((events: any[]) => {
       // console.log(events)
        this.events = events;
        this._changeDetectorRef.markForCheck();
      });
    this.LichhopForm = this._formBuilder.group({
      id: [''],
      Loaihinh: [{ value: '', disabled: this.is_disabled }],
      Tieude: [{ value: '', disabled: this.is_disabled }],
      Congty: [''],
      Chutri: [{ value: this.user.id, disabled: true }],
      Thamgia: [''],
      Ngansach: [''],
      Batdau: [''],
      Ketthuc: [''],
      Review: [''],
      Hoanthanh: [''],
      Noidung: [''],
      Trienkhai: [''],
      Ketqua: [''],
      Mongdoi: [''],
      Dieuchinh: [''],
      Dieukienkhac: [''],
      Nguyennhan: [''],
    });
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.handleEvent('Dropped or resized', event,newStart,newEnd);
  }

  handleEvent(action: string, event: CalendarEvent,snew:any,enew:any): void {
    this.sidenav.toggle();
    this.Lichhop = this.Lichhops.find(v => v.id == event.id);
    if(snew!=''){this.Lichhop.Batdau=new Date(snew)};
    if(enew!=''){this.Lichhop.Ketthuc=new Date(enew)};
    this.LichhopForm.patchValue(this.Lichhop);
    this.Title = "Cập Nhật";
    this.CRUD = 2;
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  closePicker() {
    this.picker.cancel();
  }
  // addEvent(): void {
  //   this.events = [
  //     ...this.events,
  //     {
  //       title: 'New event',
  //       start: startOfDay(new Date()),
  //       end: endOfDay(new Date()),
  //       color: colors.red,
  //       draggable: true,
  //       resizable: {
  //         beforeStart: true,
  //         afterEnd: true,
  //       },
  //     },
  //   ];
  // }
  CreateLichhop(): void {
    this.sidenav.toggle();
    const Lichhop = this.LichhopForm.getRawValue();
    this._lichhopService.CreateLichhop(Lichhop).subscribe(
      () => {
        this.notifier.notify('success', `Tạo Mới Thành Công`);
        this._changeDetectorRef.markForCheck();
      });
  }
  UpdateLichhop(): void {
    this.sidenav.toggle();
    const updateLichhop = this.LichhopForm.getRawValue();
    this._lichhopService.UpdateLichhop(updateLichhop).subscribe(
      () => {
        this.notifier.notify('success', 'Cập Nhật Thành Công');
        this._changeDetectorRef.markForCheck();
      }
    );
  }
  DeleteLichhop(): void {
    const confirmation = this._fuseConfirmationService.open({
      title: 'Xóa Lịch',
      message: 'Bạn Có Chắc Chắn Xóa Lịch Không?',
      actions: {
        confirm: {
          label: 'Xóa'
        }
      }
    });
    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        const deleteLichhop = this.LichhopForm.getRawValue();
        this._lichhopService.DeleteLichhop(deleteLichhop).subscribe(
          () => {
            this.notifier.notify('success', 'Xóa Thành Công');
            this.sidenav.toggle();
            this._changeDetectorRef.markForCheck();
          }
        );
      }
    });
  }

}
