import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'app/core/user/user.service';
import { HelpCenterService } from 'app/modules/admin/apps/help-center/help-center.service';
import { FaqCategory } from 'app/modules/admin/apps/help-center/help-center.type';
import { CauhinhService } from 'app/modules/admin/cauhinh/cauhinh.service';
import { Cauhinh } from 'app/modules/admin/cauhinh/cauhinh.types';
import moment from 'moment';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { CauhoithuonggapService } from './cauhoithuonggap.service';

@Component({
  selector: 'app-cauhoithuonggap',
  templateUrl: './cauhoithuonggap.component.html',
  styleUrls: ['./cauhoithuonggap.component.scss'],
})
export class CauhoithuonggapComponent implements OnInit {
  faqCategories: FaqCategory[];
  Cauhois:any = [];
  UserCauhois:any = [];
  filteredCauhois:any;
  Phongban: any;
  Khoi: any;
  Congty: any;
  Bophan: any;
  Vitri: any;
  thisUser: any;
  Danhmucs: any;
  filterStatus: any;
  @ViewChild('supportNgForm') supportNgForm: NgForm;
  hotros:any;
  supportForm: FormGroup;
  status:boolean;
  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private _cauhoiService: CauhoithuonggapService,
    private _cauhinhService: CauhinhService,
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    )
  {}
  displayedColumns: string[] = ['#', 'NoidungCauhoi','Ngaytao'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit(): void {
    moment.locale('vi');
    this.status = true;
    this.supportForm = this._formBuilder.group({
      Danhmuc  : [''],
      NoidungCauhoi  : [''],
  });
    this._userService.user$.subscribe((data)=>{
      this.thisUser = data;
      console.log(data);
    })
    this._cauhoiService.hotros$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((cauhois) => {
      cauhois.forEach(v => {
        v.Ngaytao = moment(v.Ngaytao, moment.ISO_8601).fromNow();
        const x =  v.Vitri.find(v1=>v1==this.thisUser.profile.Vitri);
         if(v.Trangthai == 3 && x!=undefined)
         {
             this.Cauhois.push(v);
         }                   
      });
      this.UserCauhois = cauhois.filter(v=>v.idTao == this.thisUser.id)
      console.log(this.UserCauhois);
      
      this.filteredCauhois = this.Cauhois;
      this.dataSource = new MatTableDataSource(this.Cauhois);
    });
    
    this._cauhinhService.danhmucs$.subscribe((data) => {
      this.Danhmucs = data.filter(v=>v.Module==1);
      this.Danhmucs.forEach(v => {
        v.Soluong = this.Cauhois.filter(v1=>v1.Danhmuc == v.id).length
      });
      console.log(this.Danhmucs);
      this._changeDetectorRef.markForCheck();
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
  }
// filterByQuery(query: string): void
//   {
//       if ( !query )
//       {
//           this.filteredCauhois = this.Cauhois;
//           return;
//       }
//       this.dataSource.filter = query.trim().toLowerCase();
//       if (this.dataSource.paginator) {
//         this.dataSource.paginator.firstPage();
//       }
//       this.filteredCauhois = this.Cauhois.filter(v => v.NoidungCauhoi.toLowerCase().includes(query.toLowerCase())
//       || v.NoidungTraloi.toLowerCase().includes(query.toLowerCase()));
//   }

applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

FilterDanhmuc(item): void
  {
    this.filterStatus = item.id;
    this.dataSource = new MatTableDataSource(this.Cauhois.filter(v=>v.Danhmuc == item.id));      
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
 AllDanhmuc(): void
  {
    this.filterStatus = 0;
    this.dataSource = new MatTableDataSource(this.Cauhois);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  } 
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel ="Số Lượng";
  }
ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

 openModal(templateRef) {
      let dialogRef = this.dialog.open(templateRef, {
           width: '600px',
           // data: { name: this.name, animal: this.animal }
      });

      dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          // this.animal = result;
      });
}
clearForm(): void
{
    this.status = true;
    this.supportForm = this._formBuilder.group({
      Danhmuc  : [''],
      NoidungCauhoi  : [''],
  });

}
CreateHotro(): void
{
    this.supportForm.addControl('Vitri', new FormControl([this.thisUser.profile.Vitri]));
    this.supportForm.addControl('idTao', new FormControl([this.thisUser.id]))
    const hotro = this.supportForm.getRawValue();     
    this._cauhoiService.CreateHotro(hotro).subscribe(()=>
      {
          this.clearForm();
          this.status = false;
      }
    )
}
}