import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { environment } from 'environments/environment';
import _ from 'lodash';
import { forEach } from 'lodash';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Character, characterAttributesMapping, Khachhang, KhachhangMapping } from './character.model';
import { ThongkekhService } from './thongkekh.service';
@Component({
  selector: 'app-thongkekh',
  templateUrl: './thongkekh.component.html',
  styleUrls: ['./thongkekh.component.scss']
})
export class ThongkekhComponent implements OnInit{
  characters$: Observable<Khachhang[]>;
  //displayedColumns: string[] = ['TenKH', 'SDT', 'TDS', 'TTT','LMD','NMD','LMC','NMC'];
  displayedColumns: string[] = ['NgayTaoDV','TenKH', 'SDT', 'SDT2', 'Dichvu','Doanhso','Tonglieutrinh','Dathu','Ghichu','Chinhanh'];
  thanhvienColumns: string[] = ['TenKH', 'SDT','Dathu','Chinhanh'];
  dataKhachhang: MatTableDataSource<Khachhang>;
  data: MatTableDataSource<Khachhang>;
  Thanhvien: MatTableDataSource<any>;
  data$: Observable<Khachhang[]>;
  Khachhang: MatTableDataSource<Khachhang>;
  Khachhang$: Observable<Khachhang[]>;
  FilterForm:FormGroup;
  ThanhvienForm:FormGroup;
  Member:any[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('ThanhvienPag', {static: true}) ThanhvienPag: MatPaginator;
  @ViewChild('ThanvienSort', {static: true}) ThanvienSort: MatSort;
  constructor(
    private googleSheetsDbService: GoogleSheetsDbService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _ThongkekhService :ThongkekhService,
    private _formBuilder: FormBuilder
    ) {
    // Create 100 users
    //const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));
   // this.dataSource = new MatTableDataSource(users);
  }
  ngOnInit(): void {
    this.Member = [
      {id:1,tieude:"Normal",Tu:0,Den:50000000},
      {id:2,tieude:"Member",Tu:50000000,Den:100000000},
      {id:3,tieude:"Silver",Tu:100000000,Den:200000000},
      {id:4,tieude:"Gold",Tu:200000000,Den:350000000},
      {id:5,tieude:"Platinum",Tu:350000000,Den:500000000},
      {id:6,tieude:"Diamond",Tu:500000000,Den:9900000000},
    ]
    this.FilterForm = this._formBuilder.group({
      NgayTaoDV:[''],
      Batdau:[''],
      Ketthuc:[''],
      TenKH: [''],
      SDT: [''],
      SDT2: [''],
      Dichvu: [''],
      Doanhso: [''],
      Ghichu: [''],
      Tonglieutrinh: [''],
      Chinhanh: [''],
    });

    this.ThanhvienForm = this._formBuilder.group({
      TenKH: [''],
      SDT: [''],
      Doanhso: [''],
      Chinhanh: [''],
      Hanmuctu: [''],
      Hanmucden: [''],
    });

    this._ThongkekhService.GetData().subscribe();
    this._ThongkekhService.GetKhachhang().subscribe();
    this.data$ = this._ThongkekhService.data$;
    //this.Khachhang$ = this._ThongkekhService.Khachhang$;
    
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
              const UniKH = data.filter(v1=>v1.SDT == v);
              const getKH = data.find(v1=>v1.SDT == v);
              UniKH.forEach(v1 => {
                  Sum += parseInt(v1.Dathu);
              });
              Thanhvien.push({'TenKH':getKH.TenKH,'SDT':getKH.SDT,'Dathu':Sum,'Chinhanh':getKH.Chinhanh})
          });

          console.log(Thanhvien);
          this.Thanhvien = new MatTableDataSource(Thanhvien);
          this.Thanhvien.paginator = this.ThanhvienPag;
          this.Thanhvien.sort = this.ThanvienSort;

          this.data.filterPredicate = ((data, filter) => {
            const a = !filter.TenKH || data.TenKH.toLowerCase().includes(filter.TenKH);
            const b = !filter.SDT || data.SDT.toLowerCase().includes(filter.SDT);
            const c = !filter.SDT2 || data.SDT2.toLowerCase().includes(filter.SDT2);
            const d = !filter.Dichvu || data.Dichvu.toLowerCase().includes(filter.Dichvu);
            const e = !filter.Doanhso || data.Doanhso.toLowerCase().includes(filter.Doanhso);
            const f = !filter.Ghichu || data.Ghichu.toLowerCase().includes(filter.Ghichu);
            const g = !filter.Tonglieutrinh || data.Tonglieutrinh.toLowerCase().includes(filter.Tonglieutrinh);
            const h = !filter.Batdau && !filter.Ketthuc || new Date(data.NgayTaoDV) >= filter.Batdau && new Date(data.NgayTaoDV) <= filter.Ketthuc;
            const i = !filter.Chinhanh || data.Chinhanh.toLowerCase().includes(filter.Chinhanh);
            return a && b && c && d && e && f&& g && h&& i;
          }) as (PeriodicElement, string) => boolean;

          this.FilterForm.valueChanges.subscribe(value => {
            console.log(value);
            this.data.filter = value;
          });

          this.Thanhvien.filterPredicate = ((data, filter) => {
            const a = !filter.TenKH || data.TenKH.toLowerCase().includes(filter.TenKH);
            const b = !filter.SDT || data.SDT.toLowerCase().includes(filter.SDT);
            const i = !filter.Chinhanh || data.Chinhanh.toLowerCase().includes(filter.Chinhanh);
            const e = !filter.Hanmuctu && !filter.Hanmucden || parseInt(data.Dathu) <= parseInt(filter.Hanmucden) && parseInt(data.Dathu) >= parseInt(filter.Hanmuctu);
            return a && b && e && i;
          }) as (PeriodicElement, string) => boolean;
          
          this.ThanhvienForm.valueChanges.subscribe(value => {
            console.log(value);
            this.Thanhvien.filter = value;
          });
        });

    // this.characters$ = this.googleSheetsDbService.get<Character>(
    //   environment.characters.spreadsheetId, environment.characters.worksheetName, characterAttributesMapping);
 this.Khachhang$ = this.googleSheetsDbService.get<Khachhang>(
      environment.characters.spreadsheetId, environment.characters.worksheetName, KhachhangMapping);
  this.Khachhang$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((Khachhang: Khachhang[]) => {
        //console.log(Khachhang)
        Khachhang.forEach(v => {
                  v.Doanhso = v.Doanhso.replace(/\,/g,'').replace(/\./g,''); 
                  v.Tonglieutrinh = v.Tonglieutrinh.replace(/\,/g,'').replace(/\./g,''); 
                  v.Dathu = v.Dathu.replace(/\,/g,'').replace(/\./g,''); 
                  let x = v.NgayTaoDV.toString().split("/");
                  v.NgayTaoDV = new Date(Number(x[2]),Number(x[1])-1,Number(x[0]));
            }); 
          // this.CreateData(Khachhang);          
           this.Khachhang = new MatTableDataSource(Khachhang);
           this.Khachhang.paginator = this.paginator;
           this.Khachhang.sort = this.sort;
           this._changeDetectorRef.markForCheck();

      });

  }

  Loaddata() {

  }
  ChonMember(ob) {
        let currentMember = this.Member.filter(v=>v.id == ob);
        console.log(currentMember);
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
  CreateData(dulieu:any): void
  {
    console.log(dulieu)
    dulieu.forEach((v,k) => {
      setTimeout(() => {
       this._ThongkekhService.CreateData(v)
        .subscribe((response) => {   
        });
      },10*k);
     // 100*k
      this._changeDetectorRef.markForCheck();
    });
  }
}

