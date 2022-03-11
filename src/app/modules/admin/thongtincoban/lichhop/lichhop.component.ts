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
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
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
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { Router } from '@angular/router';
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
    private _notificationsService: NotificationsService,
    private router:Router
  ) { }
  options: string[] = ['One', 'Two', 'Three'];
  @ViewChild('tabGroup', { static: false }) public tabGroup: any;
  public activeTabIndex: number | undefined = undefined;

  public handleTabChange(e: MatTabChangeEvent) {
    this.activeTabIndex = e.index;
  }
  Opentoggle() {
    this.CRUD =1;
    this.LichhopForm = this._formBuilder.group({
      Loaihinh: [{ value: '', disabled: false }],
      Tieude: [{ value: '', disabled: false }],
      Congty: [{ value: '', disabled: false }],
      Chutri: [{ value: this.user.id, disabled: true }],
      Thamgia: [{ value: '', disabled: false }],
      Ngansach: [{ value: '', disabled: false }],
      Batdau: [{ value: new Date(), disabled: false }],
      Ketthuc: [{ value: new Date(), disabled: false }],
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
        this.events = events;

        this._changeDetectorRef.markForCheck();
      });
    this.LichhopForm = this._formBuilder.group({
      id          : [''],
      Loaihinh: [{ value: '', disabled: false }],
      Tieude: [{ value: '', disabled: false }],
      Congty: [{ value: '', disabled: false }],
      Chutri: [{ value: this.user.id, disabled: true }],
      Thamgia: [{ value: '', disabled: false }],
      Ngansach: [{ value: '', disabled: false }],
      Batdau: [{ value: '', disabled: false }],
      Ketthuc: [{ value: '', disabled: false }],
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
    const confirmation = this._fuseConfirmationService.open({
      title: 'Chuyển Lịch',
      message: 'Bạn Có Chắc Chắn Chuyển Lịch Không?',
      actions: {
        confirm: {
          label: 'Có'
        }
      }
    });
    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.Lichhop = this.Lichhops.find(v => v.id == event.id);
        this.Lichhop.Batdau=new Date(newStart)
        this.Lichhop.Ketthuc=new Date(newEnd);
          this._lichhopService.UpdateLichhop(this.Lichhop).subscribe(
            () => {
              this.notifier.notify('success', 'Dời Lịch Thành Công');
              this._changeDetectorRef.markForCheck();
            }
          );
      }
    });
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.CRUD = 2;
    this.sidenav.toggle();
    this.Lichhop = this.Lichhops.find(v => v.id == event.id);
    if(this.user.id!=this.Lichhop.Chutri)
    {
      this.LichhopForm.get('Loaihinh').disable();
      this.LichhopForm.get('Tieude').disable();
      this.LichhopForm.get('Congty').disable();
      this.LichhopForm.get('Thamgia').disable();
      this.LichhopForm.get('Ngansach').disable();
      this.LichhopForm.get('Batdau').disable();
      this.LichhopForm.get('Ketthuc').disable();
    }
    this.LichhopForm.patchValue(this.Lichhop);
    this.Title = "Cập Nhật";
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
 ImportLichhop(data): void {
  data.forEach(v => {
    this._lichhopService.CreateLichhop(v).subscribe(
      () => {
        this.notifier.notify('success', `Tạo Mới Thành Công`);
        this._changeDetectorRef.markForCheck();
      });
   });
  }
 CreateLichhop(): void {
    this.sidenav.toggle();
    const Lichhop = this.LichhopForm.getRawValue();
    this._lichhopService.CreateLichhop(Lichhop).subscribe(
      (result) => {
        console.log(result);
        result.Thamgia.forEach(v => {
          const notifi = {
            idFrom: result.Chutri,
            idTo: v,
            Tieude: "Lịch Họp",
            Noidung: result.Tieude,
            Lienket: `${this.router.url}/${result.id}`,
          };

          this._notificationsService.create(notifi).subscribe();
        });
        this.notifier.notify('success', `Tạo Mới Thành Công`);
        this._changeDetectorRef.markForCheck();
      });
  }
  UpdateLichhop(): void {
    this.sidenav.toggle();
    const updateLichhop = this.LichhopForm.getRawValue();
    console.log(updateLichhop)
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
