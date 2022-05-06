import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { table } from 'console';
import { environment } from 'environments/environment';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CauhinhService } from '../../cauhinh/cauhinh.service';
import { Khachhang, KhachhangMapping } from './khachhang.type';
import { KhachhangsService } from './khachhangs.service';
// const datataza = require('app/v1json/datataza.json');
// const idtaza = require('app/v1json/idtaza.json');
@Component({
  selector: 'app-khachhangs',
  templateUrl: './khachhangs.component.html',
  styleUrls: ['./khachhangs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class KhachhangsComponent implements OnInit {
  characters$: Observable<Khachhang[]>;
  //displayedColumns: string[] = ['TenKH', 'SDT', 'TDS', 'TTT','LMD','NMD','LMC','NMC'];
  displayedColumns: string[] = ['NgayTaoDV', 'TenKH', 'SDT', 'SDT2', 'Dichvu', 'Doanhso', 'Tonglieutrinh', 'Dathu', 'Ghichu', 'Chinhanh'];
  thanhvienColumns: string[] = ['TenKH', 'SDT', 'Dathu', 'Chinhanh', 'NgayMD', 'NoiMD', 'NgayMC', 'NoiMC'];
  dataKhachhang: MatTableDataSource<Khachhang>;
  data: MatTableDataSource<Khachhang>;
  datamember: MatTableDataSource<any>;
  Thanhvien: MatTableDataSource<any>;
  data$: Observable<Khachhang[]>;
  datamember$: Observable<any>;
  count$: Observable<any>;
  Khachhang: MatTableDataSource<Khachhang>;
  Khachhang$: Observable<Khachhang[]>;
  FilterForm: FormGroup;
  Filtermember: FormGroup;
  Ngaydulieu: FormGroup;
  Member: any[];
  count: number;
  Showchitiet: boolean = false;
  CurrentUser: User;
  UserChinhanh: any;
  CauhinhChinhanh: any;
  DataDrive: any = [];
  DataServer: any = [];
  Alldata: any = [];
  datataza:any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('DataPag', { static: false }) DataPag: MatPaginator;
  @ViewChild('DataSort', { static: false }) DataSort: MatSort;
  @ViewChild('MemberPag', { static: false }) MemberPag: MatPaginator;
  @ViewChild('MemberSort', { static: false }) MemberSort: MatSort;
  constructor(
    private googleSheetsDbService: GoogleSheetsDbService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _khachhangsService: KhachhangsService,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _cauhinhService: CauhinhService,
  ) {
  }
  ngAfterViewInit(): void {
    // this.data = new MatTableDataSource(data);
    // this.data.paginator = this.DataPag;
    // this.data.sort = this.DataSort;
    // this._changeDetectorRef.markForCheck();

  }
  ngOnInit(): void {
    //this.datataza = datataza;
     // this.datataza = datataza.slice(120001,150000);
    //this._khachhangsService.GetData().subscribe();
    this._khachhangsService.GetAllMember().subscribe();
    this.data$ = this._khachhangsService.data$;
    this.datamember$ = this._khachhangsService.Member$;
    this.count$ = this._khachhangsService.count$;
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
        //this._khachhangsService.GetMember(this.UserChinhanh).subscribe();
        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
    this._cauhinhService.Cauhinhs$.subscribe((data) => {
      this.CauhinhChinhanh = data.find(v => v.id == "6e2ea777-f6e8-4738-854b-85e60655f335").detail;
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
  Reset() {
    this.Showchitiet = false;
    this.Filtermember.reset();
  }
  LoadDulieu() {
    const BD = this.Ngaydulieu.get('Batdau').value;
    const KT = this.Ngaydulieu.get('Ketthuc').value;
    this._khachhangsService.GetData().subscribe();
    this._khachhangsService.GetAllMember().subscribe();
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
      environment.characters.spreadsheetId, environment.characters.worksheetName, KhachhangMapping);
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
      //console.log(v); 
      //console.log(this.Alldata); 
      setTimeout(() => {
        this._khachhangsService.CreateData(v).subscribe();
        const x = this.Alldata.find(v1 => v1.SDT == v.SDT);
        if (x!=undefined) {
         this._khachhangsService.GetMemberBySDT(x.SDT).subscribe(res => {
            let khachhang = {
              'id': x.id,
              'TenKH': x.TenKH,
              'SDT': x.SDT,
              'SDT2': x.SDT2,
              'Dathu': parseInt(v.Dathu) + parseInt(x.Dathu),
              'Chinhanh': x.Chinhanh,
              'NgayMD': new Date(x.NgayTaoDV),
              'NoiMD': x.Chinhanh,
              'NgayMC': new Date(v.NgayTaoDV),
              'NoiMC': v.Chinhanh,
              'Ghichu': x.Ghichu + ' ' + v.Ghichu
            }
            console.log(khachhang);
            this._khachhangsService.UpdateMember(khachhang).subscribe();
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
          this._khachhangsService.CreateMember(khachhang).subscribe();
        }
      }, 10 * k);
      this._changeDetectorRef.markForCheck();
    });
  }


  // LoadMore(skip,take) {
  //   this._khachhangsService.LoadMore(skip,take).subscribe();
  //   this._changeDetectorRef.markForCheck();
  //   this.data$.subscribe(v=>
  //     {
  //       this.LoadTable(v);
  //     }
  //   )
  // }
  // LoadTable(data) {
  //       this.data = new MatTableDataSource(data);
  //       this.data.paginator = this.DataPag;
  //       this.data.sort = this.DataSort;
  //       this._changeDetectorRef.markForCheck();
  // } 
  Tongcong(data, field) {
    //console.log(data);
    if (data != undefined) { return data.reduce((a, b) => a + (Number(b[field]) || 0), 0); }
  }
  ResetSDT() {
    this.Showchitiet = false;
    this.Filtermember.reset();
  }
  LoadMember(ob) {
    this.Showchitiet = false;
    this._khachhangsService.GetMember(ob.value).subscribe();
    this.datamember$.subscribe((v) => {
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
        return a && b && e && i && c && d;
      }) as (PeriodicElement, string) => boolean;
      this.Filtermember.valueChanges.subscribe(value => {
         console.log(value)
        this.datamember.filter = value;
      });
      }
    )
  }
  GetAllMember() {
    this.Filtermember.get('Chinhanh').setValue('');
    this.Showchitiet = false;
    this._khachhangsService.GetAllMember().subscribe();
    this.datamember$.subscribe((v) => {
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
  LoadDrive() {
    this.Khachhang$ = this.googleSheetsDbService.get<Khachhang>(
      environment.characters.spreadsheetId, environment.characters.worksheetName, KhachhangMapping);
    this.Khachhang$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((Khachhang: Khachhang[]) => {
        Khachhang.forEach(v => {
          v.Doanhso = v.Doanhso.replace(/\,/g, '').replace(/\./g, '');
          v.Tonglieutrinh = v.Tonglieutrinh.replace(/\,/g, '').replace(/\./g, '');
          v.Dathu = v.Dathu.replace(/\,/g, '').replace(/\./g, '');
          // let x = v.NgayTaoDV.toString().split("/");
          // v.NgayTaoDV = new Date(Number(x[2]),Number(x[1])-1,Number(x[0]));
        });
        // console.log(Khachhang)
        this.Khachhang = new MatTableDataSource(Khachhang);
        this.Khachhang.paginator = this.DataPag;
        this.Khachhang.sort = this.DataSort;
        this._changeDetectorRef.markForCheck();
      });
  }
  // LoadAll() {
  //   console.log(this.datataza);
  //   this.Showchitiet = true;
  //       //const NewUnique = [... new Set(this.datataza.map(v => v.SDT))];
  //       const Thanhvien = [];
  //       console.log(idtaza);
  //       idtaza.forEach((v,k) => {   
  //         console.log(k);
                 
  //         let Sum = 0;
  //         const UniKH = this.datataza.filter(v1 => v1.SDT == v);   
  //         const getKH = this.datataza.find(v1 => v1.SDT == v);
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
  //           this._khachhangsService.CreateMember(v)
  //             .subscribe(() => {
  //             });
  //         }, 10 * k);
  //         this._changeDetectorRef.markForCheck();
  //       });
  //     }
  // }
  ChonMember(ob) {
    console.log(ob.value);
    let currentMember = this.Member.find(v => v.id == ob.value);
    console.log(currentMember);
    console.log(this.Filtermember);
    this.Filtermember.get('Hanmuctu').setValue(currentMember.Tu);
    this.Filtermember.get('Hanmucden').setValue(currentMember.Den);
    console.log(this.Filtermember); 
  }
  SelectMember(value) {
    this.Showchitiet = true;
    this.Filtermember.get('SDT').setValue(value.SDT);
    this._khachhangsService.LoadBySDT(value.SDT).subscribe(
      () => {
        this.data$.subscribe((v) => {
          this.data = new MatTableDataSource(v);
          this.data.paginator = this.DataPag;
          this.data.sort = this.DataSort;
          this._changeDetectorRef.markForCheck();
        }
        );
      }
    );
  }
  LoadKHSDT(value, type) {
    console.log(value, type);
    this.Showchitiet = true;
    this._khachhangsService.GetData().subscribe(
      () => {
        this.data$.subscribe((v) => {
          const x = [];
          v.forEach(v1 => {
            if (v1[type] == value) { x.push(v1) }
          });
          console.log(x);      
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
        this._khachhangsService.CreateData(v)
          .subscribe((response) => {
          });
      }, 10 * k);
      // 100*k
      this._changeDetectorRef.markForCheck();
    });
  }

  EditData(value,row)
  {
    row.SDT = value;
    this._khachhangsService.UpdateData(row,row.id).subscribe();
    console.log(value);
    console.log(row);
    
  }
  DeleteData(row)
  {
    this._khachhangsService.DeleteData(row.id).subscribe();
    console.log(row);
  }
}
