import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { NhanvienService } from 'app/modules/admin/baocao/nhanvien/nhanvien.service';
import { Nhanvien } from 'app/modules/admin/baocao/nhanvien/nhanvien.type';
import { CauhinhService } from 'app/modules/admin/cauhinh/cauhinh.service';
import { Cauhinh } from 'app/modules/admin/cauhinh/cauhinh.types';
import { Subject, takeUntil } from 'rxjs';
import { CauhoiService } from '../cauhoi.service';
@Component({
  selector: 'app-cauhoiadmin',
  templateUrl: './cauhoiadmin.component.html',
  styleUrls: ['./cauhoiadmin.component.scss']
})
export class CauhoiadminComponent implements OnInit {

  displayedColumns: string[] = ['#', 'Tieude', 'NoidungCauhoi', 'NoidungTraloi', 'Cauhoituongtu', 'Vitri', 'idTao', 'Trangthai'];
  dataSource: MatTableDataSource<any>;
  cauhois:any;
  Phongban: any;
  Khoi: any;
  Congty: any;
  Bophan: any;
  Vitri: any;
  thisUser: any;
  Nhanviens: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private _cauhoiService: CauhoiService,
    private _cauhinhService: CauhinhService,
    private _nhanvienService: NhanvienService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {
    this._cauhoiService.hotros$.subscribe((data)=>
    {
      this.dataSource = new MatTableDataSource(data);
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
    this._nhanvienService.nhanviens$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: Nhanvien[]) => {
      this.Nhanviens = data;
      this._changeDetectorRef.markForCheck();         
    });

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
