import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'environments/environment';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Khachhang, KhachhangMapping } from './khachhang.type';
import { KhachhangsService } from './khachhangs.service';
@Component({
  selector: 'app-khachhangs',
  templateUrl: './khachhangs.component.html',
  styleUrls: ['./khachhangs.component.scss']
})
export class KhachhangsComponent implements OnInit {
  characters$: Observable<Khachhang[]>;
  //displayedColumns: string[] = ['TenKH', 'SDT', 'TDS', 'TTT','LMD','NMD','LMC','NMC'];
  displayedColumns: string[] = ['NgayTaoDV', 'TenKH', 'SDT', 'SDT2', 'Dichvu', 'Doanhso', 'Tonglieutrinh', 'Dathu', 'Ghichu', 'Chinhanh'];
  thanhvienColumns: string[] = ['TenKH', 'SDT', 'Dathu', 'Chinhanh'];
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
  Member: any[];
  count:number;
  Showchitiet:boolean=false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('MemberPag', { static: true }) MemberPag: MatPaginator;
  @ViewChild('MemberSort', { static: true }) MemberSort: MatSort;
  constructor(
    private googleSheetsDbService: GoogleSheetsDbService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _khachhangsService: KhachhangsService,
    private _formBuilder: FormBuilder
  ) {
  }
  ngOnInit(): void {
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
    });
    this.data$ = this._khachhangsService.data$;
    this.datamember$ = this._khachhangsService.Member$;
    this.count$ = this._khachhangsService.count$;
    this.count$.subscribe((count) => {
        this.count = count;
      })
  }
  LoadMore(skip,take) {
    this._khachhangsService.LoadMore(skip,take).subscribe();
    this._changeDetectorRef.markForCheck();
    this.data$.subscribe(v=>
      {
        this.LoadTable(v);
      }
    )
  }
  LoadTable(data) {
    
        this.data = new MatTableDataSource(data);
        this.data.paginator = this.paginator;
        this.data.sort = this.sort;
        this._changeDetectorRef.markForCheck();
  } 
  LoadMember() {

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
          console.log(value);
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
        console.log(Khachhang)
        this.Khachhang = new MatTableDataSource(Khachhang);
        this.Khachhang.paginator = this.paginator;
        this.Khachhang.sort = this.sort;
        this._changeDetectorRef.markForCheck();
      });
  }
  LoadAll() {
    this.data$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: Khachhang[]) => {
        console.log(data);
        const NewUnique = [... new Set(data.map(v => v.SDT))];
        const Thanhvien = [];
        this.data = new MatTableDataSource(data);
        this.data.paginator = this.paginator;
        this.data.sort = this.sort;
        this._changeDetectorRef.markForCheck();
        console.log(NewUnique);
        NewUnique.forEach(v => {
          let Sum = 0;
          const UniKH = data.filter(v1 => v1.SDT == v);
          const getKH = data.find(v1 => v1.SDT == v);
          UniKH.forEach(v1 => {
            Sum += parseInt(v1.Dathu);
          });
          Thanhvien.push({ 
            'TenKH': getKH.TenKH,
            'SDT': getKH.SDT, 
            'SDT2': getKH.SDT2, 
            'Dathu': Sum, 
            'Chinhanh': getKH.Chinhanh,
            'Ghichu':getKH.Ghichu
          })
        });
        console.log(Thanhvien);

        // Thanhvien.forEach((v, k) => {
        //   setTimeout(() => {
        //     this._khachhangsService.CreateMember(v)
        //       .subscribe(() => {
        //       });
        //   }, 10 * k);
        //   this._changeDetectorRef.markForCheck();
        // });

       

        // this.Thanhvien = new MatTableDataSource(Thanhvien);
        // this.Thanhvien.paginator = this.ThanhvienPag;
        // this.Thanhvien.sort = this.ThanvienSort;
        // this.data.filterPredicate = ((data, filter) => {
        //   const a = !filter.TenKH || data.TenKH.toLowerCase().includes(filter.TenKH);
        //   const b = !filter.SDT || data.SDT.toLowerCase().includes(filter.SDT);
        //   const c = !filter.SDT2 || data.SDT2.toLowerCase().includes(filter.SDT2);
        //   const d = !filter.Dichvu || data.Dichvu.toLowerCase().includes(filter.Dichvu);
        //   const e = !filter.Doanhso || data.Doanhso.toLowerCase().includes(filter.Doanhso);
        //   const f = !filter.Ghichu || data.Ghichu.toLowerCase().includes(filter.Ghichu);
        //   const g = !filter.Tonglieutrinh || data.Tonglieutrinh.toLowerCase().includes(filter.Tonglieutrinh);
        //   const h = !filter.Batdau && !filter.Ketthuc || new Date(data.NgayTaoDV) >= filter.Batdau && new Date(data.NgayTaoDV) <= filter.Ketthuc;
        //   const i = !filter.Chinhanh || data.Chinhanh.toLowerCase().includes(filter.Chinhanh);
        //   return a && b && c && d && e && f && g && h && i;
        // }) as (PeriodicElement, string) => boolean;

        // this.FilterForm.valueChanges.subscribe(value => {
        //   console.log(value);
        //   this.data.filter = value;
        // });
        // this.Thanhvien.filterPredicate = ((data, filter) => {
        //   const a = !filter.TenKH || data.TenKH.toLowerCase().includes(filter.TenKH);
        //   const b = !filter.SDT || data.SDT.toLowerCase().includes(filter.SDT);
        //   const i = !filter.Chinhanh || data.Chinhanh.toLowerCase().includes(filter.Chinhanh);
        //   const e = !filter.Hanmuctu && !filter.Hanmucden || parseInt(data.Dathu) <= parseInt(filter.Hanmucden) && parseInt(data.Dathu) >= parseInt(filter.Hanmuctu);
        //   return a && b && e && i;
        // }) as (PeriodicElement, string) => boolean;
        // this.ThanhvienForm.valueChanges.subscribe(value => {
        //   console.log(value);
        //   this.Thanhvien.filter = value;
        // });

      });
  }
  ChonMember(ob) {
    let currentMember = this.Member.find(v => v.id == ob.value);
    this.Filtermember.get('Hanmuctu').setValue(currentMember.Tu);
    this.Filtermember.get('Hanmucden').setValue(currentMember.Den);
  }
  SelectMember(value) {
    this.Showchitiet = true;
    this.Filtermember.get('SDT').setValue(value.SDT);
    this._khachhangsService.LoadBySDT(value.SDT).subscribe((v)=>
    {
      this.data = new MatTableDataSource(v);
      this.data.paginator = this.paginator;
      this.data.sort = this.sort;
      this._changeDetectorRef.markForCheck();
    }
    );


  }
  onBookChange(ob) {
    console.log('Book changed...');
    let selectedBook = ob.value;
    console.log(selectedBook);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Khachhang.filter = filterValue.trim().toLowerCase();
    if (this.Khachhang.paginator) {
      this.Khachhang.paginator.firstPage();
    }
  }
  CreateData(dulieu: any): void {
    console.log(dulieu)
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
}