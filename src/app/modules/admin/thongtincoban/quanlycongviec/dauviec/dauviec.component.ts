import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { QuanlycongviecService } from '../quanlycongviec.service';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
@Component({
  selector: 'app-dauviec',
  templateUrl: './dauviec.component.html',
  styleUrls: ['./dauviec.component.scss']
})
export class DauviecComponent implements OnInit {
  displayedColumns: string[] = ['#','tieude', 'ngaytao'];
  dataSource = ELEMENT_DATA;
  Sections:any = [];
  Tasks:any = [];
  filteredSections:any;
  filteredTasks:any;
  constructor(
    private _quanlycongviecService : QuanlycongviecService,
    private _changeDetectorRef : ChangeDetectorRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _notifierService: NotifierService,
  ) { }
  ngOnInit(): void {
    // this.CauhoiForm = this._formBuilder.group({
    //   Danhmuc: [''],
    //   NoidungCauhoi: [''],
    //   NoidungTraloi: [''],
    //   Cauhoituongtu: [''],
    //   Vitri: [''],
    //   idTao: [''],
    // })
    // this.Status = [
    //   { id: 0, title: 'Chưa Xem' },
    //   { id: 1, title: 'Trùng Lặp' },
    //   { id: 2, title: 'Không Phù Hợp' },
    //   { id: 3, title: 'Xuất Bản' },
    // ]
    this._quanlycongviecService.getAllSection().subscribe();
    this._quanlycongviecService.sections$.subscribe((data) => {
      this.Sections = this.filteredSections = data;
      console.log(data);
      
      this._changeDetectorRef.markForCheck();
    })
    this._quanlycongviecService.getAllTaks().subscribe();
    this._quanlycongviecService.tasks$.subscribe((data) => {
      this.Tasks = this.filteredTasks = data;
      console.log(data);
      this._changeDetectorRef.markForCheck();
    })
    // this._cauhinhService.danhmucs$.subscribe((data) => {
    //   this.Danhmucs = data;
    //   this._changeDetectorRef.markForCheck();
    // })
    // this._cauhinhService.Cauhinhs$
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((data: Cauhinh[]) => {
    //     this.Phongban = data.find(v => v.id == "1eb67802-1257-4cc9-b5f6-5ebc3c3e8e4d").detail;
    //     this.Khoi = data.find(v => v.id == "295ec0c7-3d76-405b-80b9-7819ea52831d").detail;
    //     this.Congty = data.find(v => v.id == "bf076b63-3a2c-47e3-ab44-7f3c35944369").detail;
    //     this.Bophan = data.find(v => v.id == "d0694b90-6b8b-4d67-9528-1e9c315d815a").detail;
    //     this.Vitri = data.find(v => v.id == "ea424658-bc53-4222-b006-44dbbf4b5e8b").detail;
    //     this._changeDetectorRef.markForCheck();
    //   });
    // this._nhanvienService.nhanviens$
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((data: Nhanvien[]) => {
    //     this.Nhanviens = data;
    //     this._changeDetectorRef.markForCheck();
    //   });
    // this._userService.user$
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((data) => {
    //     this.thisUser = data;
    //     this._changeDetectorRef.markForCheck();
    //   });
      // combineLatest([this.filters.query$])
      // .subscribe(([query]) => {
      //     if ( query !== '' )
      //     {
      //       this.filteredCauhois = this.Cauhois;
      //     }
      //     this.filteredCauhois = this.Cauhois.filter(v => v.NoidungCauhoi.toLowerCase().includes(query.toLowerCase())
      //     || v.NoidungTraloi.toLowerCase().includes(query.toLowerCase()));
      //   this.dataSource = new MatTableDataSource(this.filteredCauhois);
      //   this.dataSource.paginator = this.paginator;
      //   this.dataSource.sort = this.sort;
      // });

  }
  GetdataSource(item) {
    return this.Tasks.filter(v=>v.sid == item.id);
  }
  createSection()
  {
    const section = {Tieude:"New Section"}
    if(this.Sections.length==0)
        {
            this._quanlycongviecService.CreateSection(section).subscribe((newsection) => {
                this._router.navigate(['./', newsection.id], {relativeTo: this._activatedRoute});
                this._changeDetectorRef.markForCheck();
            });
    }
    else
    {
        const Tieude = this.Sections[0].Tieude;
        if(Tieude=="New Section")
        {
                this._notifierService.notify('error', 'Có Section Mới Chưa Đổi Tên');
                const filterValue = "New Section";
                //this.dataSource.filter = filterValue.trim().toLowerCase();
                //this.filterByQuery("Mới");
        }
        else {

                this._quanlycongviecService.CreateSection(section).subscribe((newsection) => {
                  this._router.navigate(['./', newsection.id], {relativeTo: this._activatedRoute});
                  this._changeDetectorRef.markForCheck();
              }); 
            }
     }
    }
  CreateTaks(idSection)
  {
    const task = {Tieude:"New Task",sid:idSection}
    const checktask =  this.Tasks.filter(v=>v.sid == idSection);
    if(checktask.length==0)
        {
            this._quanlycongviecService.CreateTaks(task).subscribe((newtask) => {
                this._router.navigate(['./', newtask.id], {relativeTo: this._activatedRoute});
                this._changeDetectorRef.markForCheck();
            });
    }
    else
    {
        const Tieude = checktask[0].Tieude;
        if(Tieude=="New Task")
        {
                this._notifierService.notify('error', 'Có Task Mới Chưa Đổi Tên');
                const filterValue = "New Task";
                //this.dataSource.filter = filterValue.trim().toLowerCase();
                //this.filterByQuery("Mới");
        }
        else {

                this._quanlycongviecService.CreateTaks(task).subscribe((newtask) => {
                  this._router.navigate(['./', newtask.id], {relativeTo: this._activatedRoute});
                  this._changeDetectorRef.markForCheck();
              }); 
            }
     }
    }
    DeleteSection(item) {
      this._quanlycongviecService.DeleteSection(item.id).subscribe();
    }
    EditSection(event,item) {
      item.Tieude = event.target.value;
      this._quanlycongviecService.UpdateSection(item,item.id).subscribe();
      console.log(event.target.value);
      console.log(item);
    }

}
