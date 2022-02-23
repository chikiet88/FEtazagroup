import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { environment } from 'environments/environment';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Character, characterAttributesMapping } from './character.model';
@Component({
  selector: 'app-thongkekh',
  templateUrl: './thongkekh.component.html',
  styleUrls: ['./thongkekh.component.scss']
})
export class ThongkekhComponent implements OnInit{
  characters$: Observable<Character[]>;
  displayedColumns: string[] = ['TenKH', 'SDT', 'TDS', 'TTT','LMD','NMD','LMC','NMC'];
  dataKhachhang: MatTableDataSource<Character>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private googleSheetsDbService: GoogleSheetsDbService,
    private _changeDetectorRef: ChangeDetectorRef,
    ) {
    // Create 100 users
    //const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));
   // this.dataSource = new MatTableDataSource(users);
   
  }
  ngOnInit(): void {
    this.characters$ = this.googleSheetsDbService.get<Character>(
      environment.characters.spreadsheetId, environment.characters.worksheetName, characterAttributesMapping);
      this.characters$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((dataKH: Character[]) => {
        dataKH.forEach(v => {
          v.TDS = v.TDS.replace(/\,/g,''); 
          v.TTT = v.TTT.replace(/\,/g,''); 
            });
          this.dataKhachhang = new MatTableDataSource(dataKH);
          this.dataKhachhang.paginator = this.paginator;
          this.dataKhachhang.sort = this.sort;
          this._changeDetectorRef.markForCheck();
          
      });

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataKhachhang.filter = filterValue.trim().toLowerCase();
    if (this.dataKhachhang.paginator) {
      this.dataKhachhang.paginator.firstPage();
    }
  }
}

