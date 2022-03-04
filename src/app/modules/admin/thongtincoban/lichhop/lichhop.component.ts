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
import { Subject, takeUntil } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
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
  encapsulation: ViewEncapsulation.None,

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
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();
  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  activeDayIsOpen: boolean = false;
  LichhopForm: FormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  Phongban: object;
  Khoi: object;
  Congty: object;
  Bophan: object;
  Vitri: object;
  Title:string;
  constructor(
    private _fuseDrawerService: FuseDrawerService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _CauhinhService: CauhinhService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _lichhopService:LichhopService,
    ){}
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
      this.sidenav.toggle();
    }
  ngOnInit(): void {
    this.activeTabIndex = 0;
    this.Title = "Thêm Mới"
     this._CauhinhService.Cauhinhs$
       .pipe(takeUntil(this._unsubscribeAll))
       .subscribe((data: Cauhinh[]) => {
            console.log(data);
            this.Phongban = data.find(v=>v.id =="1eb67802-1257-4cc9-b5f6-5ebc3c3e8e4d").detail;
            this.Khoi = data.find(v=>v.id =="295ec0c7-3d76-405b-80b9-7819ea52831d").detail;
            this.Congty = data.find(v=>v.id =="bf076b63-3a2c-47e3-ab44-7f3c35944369").detail;
            this.Bophan = data.find(v=>v.id =="d0694b90-6b8b-4d67-9528-1e9c315d815a").detail;
            this.Vitri = data.find(v=>v.id =="ea424658-bc53-4222-b006-44dbbf4b5e8b").detail;
           this._changeDetectorRef.markForCheck();
       });

    this.LichhopForm = this._formBuilder.group({
      Loaihinh    : [{value: '', disabled: this.is_disabled}],
      Tieude: [{value: '', disabled: this.is_disabled}],
      Congty: [''],
      Chutri: [''],
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
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }
  handleEvent(action: string, event: CalendarEvent): void {
    this.Title = "Cập Nhật";
    this.toggle();   
  }
  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
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
  CreateLichhop(): void
  {
    this.toggle();
    const Lichhop = this.LichhopForm.getRawValue();
    console.log(Lichhop);
    // contact.emails = contact.emails.filter(email => email.email);
    // contact.phoneNumbers = contact.phoneNumbers.filter(phoneNumber => phoneNumber.phoneNumber);
      this._lichhopService.CreateLichhop(Lichhop).subscribe((data) => {
        console.log(data);
        this.toggle();   
      });
  }


}
