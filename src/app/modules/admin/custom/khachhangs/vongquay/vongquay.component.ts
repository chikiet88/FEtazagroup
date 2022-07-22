import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CauhinhService } from 'app/modules/admin/cauhinh/cauhinh.service';
import { KhachhangsService } from '../khachhangs.service';
@Component({
  selector: 'app-vongquay',
  templateUrl: './vongquay.component.html',
  styleUrls: ['./vongquay.component.scss']
})
export class VongquayComponent implements OnInit {
  displayedColumns: string[] = ['TenKH', 'SDT', 'Giaithuong', 'MaSo', 'Chinhanh'];
  dataSource: MatTableDataSource<any>;
  GTChitiet:any[]=[];
  Giaithuong:any[]=[];
  Dataraw:any[]=[];
  Chinhanh:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
     private _khachhangsService: KhachhangsService,
     private _cauhinhService: CauhinhService,
     ) {
    this._cauhinhService.Cauhinhs$.subscribe((data) => {
      this.Chinhanh = data.find(v => v.id == "6e2ea777-f6e8-4738-854b-85e60655f335").detail;
    })
    this._khachhangsService.GetAllGiaithuongchitiets().subscribe();
    this._khachhangsService.GetAllGiaithuong().subscribe();
    this._khachhangsService.GetAllDataraws().subscribe();
    this._khachhangsService.giaithuongchitiets$.subscribe(data=>
      {
 
        if(data!=null)
        {
        let source = [];
        this.GTChitiet = source = data;  
        this._khachhangsService.giaithuongs$.subscribe(data1=>
          {
            if(data1!=null)
            {
            this.Giaithuong = data1;

            this._khachhangsService.dataraws$.subscribe(data2=>
              {
                console.log(this.Giaithuong);
                
                if(data2!=null)
                {
                this.Dataraw = data2;
                    this.GTChitiet.forEach(v => {
                      v.TenKH = this.Dataraw.find(v1=>v1.id==v.idData).TenKH
                      v.SDT = this.Dataraw.find(v1=>v1.id==v.idData).SDT
                      v.Chinhanh = this.Dataraw.find(v1=>v1.id==v.idData).Chinhanh
                      v.Giaithuong = this.Giaithuong.find(v2=>v2.id==v.idGT).Tieude
                      v.MaSo = this.Giaithuong.find(v2=>v2.id==v.idGT).MaSo
                  });
                  this.dataSource = new MatTableDataSource(this.GTChitiet);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                  console.log(this.GTChitiet);
                } 
              })
            }
          })  
        } 
      })
      
  }
  ngOnInit(): void {

  }
  ngAfterViewInit() {
  }

}
