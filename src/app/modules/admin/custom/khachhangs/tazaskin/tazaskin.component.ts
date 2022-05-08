import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CauhinhService } from '../../../cauhinh/cauhinh.service';
import { Khachhang, KhachhangMapping } from '../khachhang.type';
import { KhachhangsService } from '../khachhangs.service';
 @Component({
    selector: 'app-tazaskin',
    templateUrl: './tazaskin.component.html',
    styleUrls: ['./tazaskin.component.scss'],
    encapsulation: ViewEncapsulation.None,
  })
  export class TazaskinComponent implements OnInit {
  characters$: Observable<Khachhang[]>;
  displayedColumns: string[] = ['NgayTaoDV', 'TenKH', 'SDT', 'SDT2', 'Dichvu', 'Doanhso', 'Tonglieutrinh', 'Dathu', 'Ghichu', 'Chinhanh'];
  thanhvienColumns: string[] = ['TenKH', 'SDT', 'Dathu', 'Chinhanh', 'NgayMD', 'NoiMD', 'NgayMC', 'NoiMC'];
  dataKhachhang: MatTableDataSource<Khachhang>;
  data: MatTableDataSource<Khachhang>;
  datamember: MatTableDataSource<any>;
  Thanhvien: MatTableDataSource<any>;
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

  }
  ngOnInit(): void {
    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.CurrentUser = user;
        Object.keys(this.CurrentUser.Phanquyen).forEach(key => {
          if (!this.CurrentUser.Phanquyen[key]) delete this.CurrentUser.Phanquyen[key];
        });
        this.UserChinhanh = this.CurrentUser.Phanquyen;
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
  LoadAll()
  {
    this._khachhangsService.GetAllDataTaza().subscribe();
    this._khachhangsService.datastaza$.subscribe((data)=>
      {
        this.Alldata = data;
        const Unique = [... new Set(data.map(v => v.SDT))];
        const Thanhvien = []; 
        Unique.forEach((v,k) => {       
          const UniKH = data.filter(v1 => v1.SDT == v);
          if(UniKH.length==1 && UniKH[0].SDT!="")   
          {
            UniKH[0].NgayMD = UniKH[0].NgayMC = UniKH[0].NgayTaoDV;
            UniKH[0].NoiMD  = UniKH[0].NoiMC = UniKH[0].Chinhanh;
            Thanhvien.push(UniKH[0]);
          }
          else
          {
          const result = UniKH.reduce((a, b) => (
            {
              'TenKH': UniKH[UniKH.length-1].TenKH,
              'SDT': UniKH[UniKH.length-1].SDT, 
              'SDT2': UniKH[UniKH.length-1].SDT2, 
              'Dathu': a.Dathu + b.Dathu,
              'Chinhanh': UniKH[UniKH.length-1].Chinhanh,
              'NgayMD': UniKH[UniKH.length-1].NgayTaoDV,
              'NoiMD':UniKH[UniKH.length-1].Chinhanh,
              'NgayMC': UniKH[0].NgayTaoDV,
              'NoiMC': UniKH[0].Chinhanh,
              'Ghichu':a.Ghichu + b.Ghichu
            }
            ));
            Thanhvien.push(result)
          }
           
        });
        this.datamember = new MatTableDataSource(Thanhvien);
        this.datamember.paginator = this.MemberPag;
        this.datamember.sort = this.MemberSort;
        this.datamember.filterPredicate = ((data, filter) => {
          const a = !filter.TenKH || data.TenKH.toLowerCase().includes(filter.TenKH.toLowerCase());
          const b = !filter.SDT || data.SDT.toLowerCase().includes(filter.SDT);
          const i = !filter.Chinhanh || data.Chinhanh.includes(filter.Chinhanh);
          const e = !filter.Hanmuctu && !filter.Hanmucden || data.Dathu <= filter.Hanmucden && data.Dathu >= filter.Hanmuctu;
          const c = !filter.NgayMDStart && !filter.NgayMDEnd || new Date(data.NgayMD) <= filter.NgayMDEnd && new Date(data.NgayMD) >= filter.NgayMDStart;
          const d = !filter.NgayMCStart && !filter.NgayMCEnd || new Date(data.NgayMC) <= filter.NgayMCEnd && new Date(data.NgayMC) >= filter.NgayMCStart;
          return a && b && e && i && c && d;
        }) as (PeriodicElement, string) => boolean;
        this.Filtermember.valueChanges.subscribe(value => {
          this.datamember.filter = value;
        });
      }
    )
  }
  Reset() {
    this.Showchitiet = false;
    this.Filtermember.reset();
  }
  LoadDulieu() {
    const BD = this.Ngaydulieu.get('Batdau').value;
    const KT = this.Ngaydulieu.get('Ketthuc').value;
    this._khachhangsService.GetAllDataTaza().subscribe();
    this._khachhangsService.datastaza$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((Khachhang: Khachhang[]) => {
        if (Khachhang != null) {
          this.DataServer = Khachhang.filter(v => new Date(v.NgayTaoDV) >= BD && new Date(v.NgayTaoDV) <= KT);
        }
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
      });
  }
  UpdateDulieu(data) {
    data.forEach((v, k) => {
      setTimeout(() => {
        this._khachhangsService.CreateDataTaza(v).subscribe();
      this._changeDetectorRef.markForCheck();
    },k*10);
  })
  }
  Tongcong(data, field) {
    if (data != undefined) { return data.reduce((a, b) => a + (Number(b[field]) || 0), 0); }
  }
  ResetSDT() {
    this.Showchitiet = false;
    this.Filtermember.reset();
  }
  LoadData(Chinhanh) {
    this.Showchitiet = false;
    this._khachhangsService.GetDataTazaByChiNhanh(Chinhanh).subscribe();
    this._khachhangsService.datastaza$.subscribe((data)=>
      {
        this.Alldata = data;
        const Unique = [... new Set(data.map(v => v.SDT))];
        const Thanhvien = []; 
        Unique.forEach((v,k) => {       
          const UniKH = data.filter(v1 => v1.SDT == v);
          if(UniKH.length==1 && UniKH[0].SDT!="")   
          {
            UniKH[0].NgayMD = UniKH[0].NgayMC = UniKH[0].NgayTaoDV;
            UniKH[0].NoiMD  = UniKH[0].NoiMC = UniKH[0].Chinhanh;
            Thanhvien.push(UniKH[0]);
          }
          else
          {
          const result = UniKH.reduce((a, b) => (
            {
              'TenKH': UniKH[UniKH.length-1].TenKH,
              'SDT': UniKH[UniKH.length-1].SDT, 
              'SDT2': UniKH[UniKH.length-1].SDT2, 
              'Dathu': a.Dathu + b.Dathu,
              'Chinhanh': UniKH[UniKH.length-1].Chinhanh,
              'NgayMD': UniKH[UniKH.length-1].NgayTaoDV,
              'NoiMD':UniKH[UniKH.length-1].Chinhanh,
              'NgayMC': UniKH[0].NgayTaoDV,
              'NoiMC': UniKH[0].Chinhanh,
              'Ghichu':a.Ghichu + b.Ghichu
            }
            ));
            Thanhvien.push(result)
          }
           
        });
        this.datamember = new MatTableDataSource(Thanhvien);
        this.datamember.paginator = this.MemberPag;
        this.datamember.sort = this.MemberSort;
        this.datamember.filterPredicate = ((data, filter) => {
          const a = !filter.TenKH || data.TenKH.toLowerCase().includes(filter.TenKH.toLowerCase());
          const b = !filter.SDT || data.SDT.toLowerCase().includes(filter.SDT);
          const i = !filter.Chinhanh || data.Chinhanh.includes(filter.Chinhanh);
          const e = !filter.Hanmuctu && !filter.Hanmucden || data.Dathu <= filter.Hanmucden && data.Dathu >= filter.Hanmuctu;
          const c = !filter.NgayMDStart && !filter.NgayMDEnd || new Date(data.NgayMD) <= filter.NgayMDEnd && new Date(data.NgayMD) >= filter.NgayMDStart;
          const d = !filter.NgayMCStart && !filter.NgayMCEnd || new Date(data.NgayMC) <= filter.NgayMCEnd && new Date(data.NgayMC) >= filter.NgayMCStart;
          return a && b && e && i && c && d;
        }) as (PeriodicElement, string) => boolean;
        this.Filtermember.valueChanges.subscribe(value => {
          this.datamember.filter = value;
        });
      }
    )
  }
  ChonMember(ob) {
    let currentMember = this.Member.find(v => v.id == ob.value);
    this.Filtermember.get('Hanmuctu').setValue(currentMember.Tu);
    this.Filtermember.get('Hanmucden').setValue(currentMember.Den);
  }
  LoadKHSDT(value) {
    this.Showchitiet = true;
    this.Filtermember.get('SDT').setValue(value);
    const Selectdata = this.Alldata.filter(v=>v.SDT ==value);
    this.data = new MatTableDataSource(Selectdata);
    this.data.paginator = this.DataPag;
    this.data.sort = this.DataSort;
    this._changeDetectorRef.markForCheck();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Khachhang.filter = filterValue.trim().toLowerCase();
    if (this.Khachhang.paginator) {
      this.Khachhang.paginator.firstPage();
    }
  }
  EditData(value,row)
  {
   row.SDT = value;
   this._khachhangsService.UpdateDataTaza(row,row.id).subscribe();
  }
  DeleteData(row)
  {
    this._khachhangsService.DeleteDataTaza(row.id).subscribe();
  }
}
