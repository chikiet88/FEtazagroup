import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CauhinhService } from '../../cauhinh/cauhinh.service';
import { Khachhang, KhachhangMapping } from './khtimona.type';
import { KhtimonaService } from './khtimona.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
//const datatimona = require('app/v1json/datatimona.json');
@Component({
  selector: 'app-khtimona',
  templateUrl: './khtimona.component.html',
  styleUrls: ['./khtimona.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class KhtimonaComponent implements OnInit {
  characters$: Observable<Khachhang[]>;
  //displayedColumns: string[] = ['TenKH', 'SDT', 'TDS', 'TTT','LMD','NMD','LMC','NMC'];
  displayedColumns: string[] = ['NgayTaoDV', 'TenKH', 'SDT', 'SDT2', 'Dichvu', 'Doanhso', 'Tonglieutrinh', 'Dathu', 'Ghichu', 'Chinhanh'];
  thanhvienColumns: string[] = ['TenKH', 'SDT', 'Dathu', 'Chinhanh','NgayMD','NoiMD','NgayMC','NoiMC'];
  dataKhachhang: Khachhang[];
  data: MatTableDataSource<Khachhang>;
  datamember: MatTableDataSource<any>;
  Thanhvien: MatTableDataSource<any>;
  data$: Observable<any>;
  datamember$: Observable<any>;
  count$: Observable<any>;
  Khachhang: MatTableDataSource<Khachhang>;
  Khachhang$: Observable<Khachhang[]>;
  FilterForm: FormGroup;
  Filtermember: FormGroup;
  Ngaydulieu: FormGroup;
  Member: any[];
  count:number;
  Showchitiet:boolean=false;
  CurrentUser:User;
  UserChinhanh:any;
  CauhinhChinhanh:any;
  DataDrive: any = [];
  DataServer: any = [];
  Alldata: any = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild('DataPag', { static: false }) DataPag: MatPaginator;
  @ViewChild('DataSort', { static: false }) DataSort: MatSort;
  @ViewChild('MemberPag', { static: false }) MemberPag: MatPaginator;
  @ViewChild('MemberSort', { static: false }) MemberSort: MatSort;
  constructor(
    private googleSheetsDbService: GoogleSheetsDbService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _khtimonaService: KhtimonaService,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _cauhinhService: CauhinhService,
  ) {
  }
  ngOnInit(): void {
    //console.log(datatimona);
    this._khtimonaService.GetData().subscribe();
    this._khtimonaService.GetAllMember().subscribe();
    this.data$ = this._khtimonaService.data$;
    this.datamember$ = this._khtimonaService.Member$;
    this.count$ = this._khtimonaService.count$;
    this.count$.subscribe((count) => {
        this.count = count;
      })
    this.datamember$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((Alldata) => {
        this.Alldata = Alldata;
      })
    this._userService.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((user: User) => {
        this.CurrentUser = user;
        Object.keys(this.CurrentUser.Phanquyen).forEach(key => {
          if (!this.CurrentUser.Phanquyen[key]) delete this.CurrentUser.Phanquyen[key];
        });
        this.UserChinhanh = this.CurrentUser.Phanquyen;        
        //this._khtimonaService.GetMember(this.UserChinhanh).subscribe();
        // Mark for check
        console.log(this.CurrentUser);
        
        this._changeDetectorRef.markForCheck();
    });
    this._cauhinhService.Cauhinhs$.subscribe((data)=>{ 
      this.CauhinhChinhanh = data.find(v=>v.id =="6e2ea777-f6e8-4738-854b-85e60655f335").detail;
    }
      );

    this.Member = [
      { id: 0, tieude: "All", Tu: '', Den: '' },
      { id: 1, tieude: "Normal", Tu: 0, Den: 50000000 },
      { id: 2, tieude: "Member", Tu: 50000000, Den: 100000000 },
      { id: 3, tieude: "Silver", Tu: 100000000, Den: 200000000 },
      { id: 4, tieude: "Gold", Tu: 200000000, Den: 350000000 },
      { id: 5, tieude: "Platinum", Tu: 350000000, Den: 500000000 },
      { id: 6, tieude: "Diamond", Tu: 500000000, Den: 9900000000 },
    ]
    this.FilterForm = this._formBuilder.group({
      NgayTaoDV: [''],
      Batdau: [''],
      Ketthuc: [''],
      TenKH: [''],
      SDT: [''],
      SDT2: [''],
      Dichvu: [''],
      Doanhso: [''],
      Ghichu: [''],
      Tonglieutrinh: [''],
      Chinhanh: [''],
    });

    this.Filtermember = this._formBuilder.group({
      TenKH: [''],
      SDT: [''],
      Doanhso: [''],
      Chinhanh: [''],
      Hanmuctu: [''],
      Hanmucden: [''],
      NgayMDStart: [''],
      NgayMDEnd: [''],
      NgayMCStart: [''],
      NgayMCEnd: [''],
    });
    this.Ngaydulieu = this._formBuilder.group({
      Batdau: [new Date()],
      Ketthuc: [new Date()],
    });
  }
  LoadMore(skip,take) {
    this._khtimonaService.LoadMore(skip,take).subscribe();
    this._changeDetectorRef.markForCheck();
    this.data$.subscribe(v=>
      {
        this.LoadTable(v);
      }
    )
  }
  LoadTable(data) {
        this.data = new MatTableDataSource(data);
        this.data.paginator = this.DataPag;
        this.data.sort = this.DataSort;
        this._changeDetectorRef.markForCheck();
  } 
  Tongcong(data,field) {
    //console.log(data);
    if(data!=undefined)
    {    return data.reduce((a, b) => a + (Number(b[field]) || 0), 0);}}
  Reset()
  {   
    this.Showchitiet = false;
    this.Filtermember.reset();
  }
  LoadDulieu() {
    const BD = this.Ngaydulieu.get('Batdau').value;
    const KT = this.Ngaydulieu.get('Ketthuc').value;
    this._khtimonaService.GetData().subscribe();
    this._khtimonaService.GetAllMember().subscribe();

    this.datamember$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((Alldata) => {
        this.Alldata = Alldata;
      })
    this.data$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((Khachhang: Khachhang[]) => {
        if (Khachhang != null) {
          this.DataServer = Khachhang.filter(v => new Date(v.NgayTaoDV) >= BD && new Date(v.NgayTaoDV) <= KT);
        }
       // console.log(this.DataServer);
      })

    this.Khachhang$ = this.googleSheetsDbService.get<Khachhang>(
      environment.khtimona.spreadsheetId, environment.khtimona.worksheetName, KhachhangMapping);
    this.Khachhang$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((Khachhang: Khachhang[]) => {
        Khachhang.forEach(v => {
          v.Doanhso = v.Doanhso.replace(/\,/g, '').replace(/\./g, '');
          v.Tonglieutrinh = v.Tonglieutrinh.replace(/\,/g, '').replace(/\./g, '');
          v.Dathu = v.Dathu.replace(/\,/g, '').replace(/\./g, '');
          let x = v.NgayTaoDV.toString().split("/");
          v.NgayTaoDV = new Date(Number(x[2]), Number(x[1]) - 1, Number(x[0]));
        });
        this.DataDrive = Khachhang.filter(v => v.NgayTaoDV >= BD && v.NgayTaoDV <= KT);
        console.log(this.DataDrive)
      });
  }
  UpdateDulieu(data) {
    data.forEach((v, k) => {
      setTimeout(() => {
        this._khtimonaService.CreateData(v).subscribe();
        console.log(this.Alldata);
        const x = this.Alldata.find(v1 => v1.SDT == v.SDT);
        console.log(x);
        if (x!=undefined) {
          this._khtimonaService.GetMemberBySDT(x.SDT).subscribe(data => {
            let khachhang = {
              'id': x.id,
              'TenKH': v.TenKH,
              'SDT': v.SDT,
              'SDT2': v.SDT2,
              'Dathu': parseInt(v.Dathu) + parseInt(x.Dathu),
              'Chinhanh': x.Chinhanh,
              'NgayMD': new Date(x.NgayTaoDV),
              'NoiMD': x.Chinhanh,
              'NgayMC': new Date(v.NgayTaoDV),
              'NoiMC': v.Chinhanh,
              'Ghichu': x.Ghichu + ' ' + v.Ghichu
            }
          console.log(khachhang);
            this._khtimonaService.UpdateMember(khachhang).subscribe();
          })
        }
        else {
          let khachhang = {
            'TenKH': v.TenKH,
            'SDT': v.SDT,
            'SDT2': v.SDT2,
            'Dathu': v.Dathu,
            'Chinhanh': v.Chinhanh,
            'NgayMD': new Date(v.NgayTaoDV),
            'NoiMD': v.Chinhanh,
            'NgayMC': new Date(v.NgayTaoDV),
            'NoiMC': v.Chinhanh,
            'Ghichu': v.Ghichu
          }
          console.log(khachhang);
          this._khtimonaService.CreateMember(khachhang).subscribe();
        }
      }, 10 * k);
      this._changeDetectorRef.markForCheck();
    });
  }

  LoadMember(ob) {
    this.Showchitiet = false;
    this._khtimonaService.GetMember(ob.value).subscribe();
    this.datamember$.subscribe((v)=>{
        this.datamember = new MatTableDataSource(v);       
        this.datamember.paginator = this.MemberPag;
        this.datamember.sort = this.MemberSort;
        this._changeDetectorRef.markForCheck();
       this.datamember.filterPredicate = ((data, filter) => {
          const a = !filter.TenKH || data.TenKH.toLowerCase().includes(filter.TenKH);
          const b = !filter.SDT || data.SDT.toLowerCase().includes(filter.SDT);
          const i = !filter.Chinhanh || data.Chinhanh.includes(filter.Chinhanh);
          const e = !filter.Hanmuctu && !filter.Hanmucden || data.Dathu <= filter.Hanmucden && data.Dathu >= filter.Hanmuctu;
          const c = !filter.NgayMDStart && !filter.NgayMDEnd || new Date(data.NgayMD) <= filter.NgayMDEnd && new Date(data.NgayMD) >= filter.NgayMDStart;
          const d = !filter.NgayMCStart && !filter.NgayMCEnd || new Date(data.NgayMC) <= filter.NgayMCEnd && new Date(data.NgayMC) >= filter.NgayMCStart;
          return a && b && e && i&& c&& d;
        }) as (PeriodicElement, string) => boolean;
        this.Filtermember.valueChanges.subscribe(value => {
         // console.log(value)
          this.datamember.filter = value;
        });
      }


    )
  } 
  GetAllMember() {
    this.Filtermember.get('Chinhanh').setValue('');
    this.Showchitiet = false;
    this._khtimonaService.GetAllMember().subscribe();
    this.datamember$.subscribe((v)=>{
        this.datamember = new MatTableDataSource(v);
        this.datamember.paginator = this.MemberPag;
        this.datamember.sort = this.MemberSort;
        this._changeDetectorRef.markForCheck();
       this.datamember.filterPredicate = ((data, filter) => {
          const a = !filter.TenKH || data.TenKH.toLowerCase().includes(filter.TenKH);
          const b = !filter.SDT || data.SDT.toLowerCase().includes(filter.SDT);
          const i = !filter.Chinhanh || data.Chinhanh.includes(filter.Chinhanh);
          const e = !filter.Hanmuctu && !filter.Hanmucden || data.Dathu <= filter.Hanmucden && data.Dathu >= filter.Hanmuctu;
          return a && b && e && i;
        }) as (PeriodicElement, string) => boolean;
        this.Filtermember.valueChanges.subscribe(value => {
          this.datamember.filter = value;
        });
      }
    )
  } 
  // LoadAll() {
  //   console.log(datatimona);
  //       const NewUnique = [... new Set(datatimona.map(v => v.SDT))];
  //       const Thanhvien = [];
  //       console.log(NewUnique);
  //       NewUnique.forEach((v,k) => {     
  //         let Sum = 0;
  //         const UniKH = datatimona.filter(v1 => v1.SDT == v);   
  //         const getKH = datatimona.find(v1 => v1.SDT == v);
  //         console.log(getKH);
  //         if(getKH!=undefined)
  //         {
  //           UniKH.forEach(v1 => {
  //             Sum += parseInt(v1.Dathu);
  //           });
  //           let x = UniKH.length-1;
  //           Thanhvien.push({ 
  //             'TenKH': getKH.TenKH,
  //             'SDT': getKH.SDT, 
  //             'SDT2': getKH.SDT2, 
  //             'Dathu': Sum, 
  //             'Chinhanh': getKH.Chinhanh,
  //             'NgayMD': UniKH[x].NgayTaoDV,
  //             'NoiMD': UniKH[x].Chinhanh,
  //             'NgayMC': UniKH[0].NgayTaoDV,
  //             'NoiMC': UniKH[0].Chinhanh,
  //             'Ghichu':getKH.Ghichu
  //           })
  //        }
  //       });
  //       //console.log(Thanhvien);
  //       if(Thanhvien.length!=0)
  //       {
  //       Thanhvien.forEach((v, k) => {         
  //         setTimeout(() => {
  //           this._khtimonaService.CreateMember(v)
  //             .subscribe(() => {
  //             });
  //         }, 10 * k);
  //         this._changeDetectorRef.markForCheck();
  //       });
  //     }


  //   this._khtimonaService.ClearKhachhang().subscribe();
  //   this._khtimonaService.GetData().subscribe();
  //   this.Showchitiet = true;
  //   this.data$
  //     .pipe(takeUntil(this._unsubscribeAll))
  //     .subscribe((data: Khachhang[]) => {
  //       console.log(data);
  //       this.data = new MatTableDataSource(data);
  //       this.data.paginator = this.DataPag;
  //       this.data.sort = this.DataSort;
  //       this._changeDetectorRef.markForCheck();
  //     });
  // }
  ChonMember(ob) {
    let currentMember = this.Member.find(v => v.id == ob.value);
    this.Filtermember.get('Hanmuctu').setValue(currentMember.Tu);
    this.Filtermember.get('Hanmucden').setValue(currentMember.Den);
  }
  SelectMember(value) {
    this.Showchitiet = true;
    this.Filtermember.get('SDT').setValue(value.SDT);
    this._khtimonaService.LoadBySDT(value.SDT).subscribe(
      ()=>{
        this.data$.subscribe((v)=>{
          this.data = new MatTableDataSource(v);
          this.data.paginator = this.DataPag;
          this.data.sort = this.DataSort;
          this._changeDetectorRef.markForCheck();
        }
        );
      }
    );
  }
  SelecByTenKH(value) {
    this.Showchitiet = true;
    this.Filtermember.get('TenKH').setValue(value.toLowerCase());
    this._khtimonaService.LoadByTenKH(value.toLowerCase()).subscribe(
      ()=>{
        this.data$.subscribe((v)=>{
          this.data = new MatTableDataSource(v);
          this.data.paginator = this.DataPag;
          this.data.sort = this.DataSort;
          this._changeDetectorRef.markForCheck();
        }
        );
      }
    );
  }
  LoadKHSDT(value,type) {
    console.log(value,type);
    this.Filtermember.get(type).setValue(value.toLowerCase());
    this.Showchitiet = true;
    this._khtimonaService.GetData().subscribe(
      ()=>{
        this.data$.subscribe((v)=>{         
          const x = [];
          v.forEach(v1 => {
            if(v1[type] == value)
            {x.push(v1)}
          });         
          this.data = new MatTableDataSource(x);
          this.data.paginator = this.DataPag;
          this.data.sort = this.DataSort;
          this._changeDetectorRef.markForCheck();
        }
        );
      }
    );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Khachhang.filter = filterValue.trim().toLowerCase();
    if (this.Khachhang.paginator) {
      this.Khachhang.paginator.firstPage();
    }
  }
  CreateData(dulieu: any): void {
   //console.log(dulieu)
    dulieu.forEach(v1 => {
      let x = v1.NgayTaoDV.toString().split("/");
      v1.NgayTaoDV = new Date(Number(x[2]), Number(x[1]) - 1, Number(x[0]));
    });
    dulieu.forEach((v, k) => {
      setTimeout(() => {
        this._khtimonaService.CreateData(v)
          .subscribe((v1) => {
            //console.log(v1);
          });
      }, 10 * k);
      this._changeDetectorRef.markForCheck();
    });
  }
  EditData(value,row)
  {
    row.SDT = value;
    this._khtimonaService.UpdateData(row,row.id).subscribe();
    console.log(value);
    console.log(row);
    
  }
}
