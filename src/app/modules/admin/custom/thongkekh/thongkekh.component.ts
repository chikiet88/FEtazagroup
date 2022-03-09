import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { environment } from 'environments/environment';
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
  characters$: Observable<Character[]>;
  //displayedColumns: string[] = ['TenKH', 'SDT', 'TDS', 'TTT','LMD','NMD','LMC','NMC'];
  displayedColumns: string[] = ['NgayTaoDV','TenKH', 'SDT', 'SDT2', 'Dichvu','Doanhso','Tonglieutrinh','Dathu','Ghichu','Chinhanh'];
  dataKhachhang: MatTableDataSource<Character>;
  data: MatTableDataSource<Character>;
  data$: Observable<Character[]>;
  Khachhang: MatTableDataSource<Khachhang>;
  Khachhang$: Observable<Khachhang[]>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private googleSheetsDbService: GoogleSheetsDbService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _ThongkekhService :ThongkekhService
    ) {
    // Create 100 users
    //const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));
   // this.dataSource = new MatTableDataSource(users);
   
  }
  ngOnInit(): void {

    this._ThongkekhService.GetData().subscribe();
    this._ThongkekhService.GetKhachhang().subscribe();
    this.data$ = this._ThongkekhService.data$;
    this.data$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Character[]) => {
          this.data = new MatTableDataSource(data);
          this.data.paginator = this.paginator;
          this.data.sort = this.sort;
          this._changeDetectorRef.markForCheck();
        });

    this.characters$ = this.googleSheetsDbService.get<Character>(
      environment.characters.spreadsheetId, environment.characters.worksheetName, characterAttributesMapping);
    this.Khachhang$ = this.googleSheetsDbService.get<Khachhang>(
      environment.characters.spreadsheetId, environment.characters.worksheetName, KhachhangMapping);


  this.Khachhang$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((Khachhang: Khachhang[]) => {
        console.log(Khachhang)
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



  // this.characters$
  //     .pipe(takeUntil(this._unsubscribeAll))
  //     .subscribe((dataKH: Character[]) => {
  //           dataKH.forEach(v => {
  //                 v.TDS = v.TDS.replace(/\,/g,''); 
  //                 v.TTT = v.TTT.replace(/\,/g,''); 
  //                 let x = v.LMD.toString().split("/");
  //                 v.LMD = new Date(Number(x[2]),Number(x[1])-1,Number(x[0]));
  //                 let y = v.LMC.toString().split("/");
  //                 v.LMC = new Date(Number(y[2]),Number(y[1])-1,Number(y[0]));
  //           }); 
  //          this.dataKhachhang = new MatTableDataSource(dataKH);
  //         this.dataKhachhang.paginator = this.paginator;
  //          this.dataKhachhang.sort = this.sort;
  //          this._changeDetectorRef.markForCheck();
          
  //     });

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
    dulieu.forEach(v => {
      setTimeout(() => {
        this._ThongkekhService.CreateData(v)
        .subscribe((response) => {
        });
      },30000);
      this._changeDetectorRef.markForCheck();
    });
  }
}

