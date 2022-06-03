import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { QuanlycongviecService } from '../quanlycongviec.service';
import { QuanlycongviecComponent } from '../quanlycongviec.component';
import { Cauhinh } from 'app/modules/admin/cauhinh/cauhinh.types';
import { takeUntil } from 'rxjs';
import { CauhinhService } from 'app/modules/admin/cauhinh/cauhinh.service';
import { NhanvienService } from 'app/modules/admin/baocao/nhanvien/nhanvien.service';

@Component({
  selector: 'app-tongquan',
  templateUrl: './tongquan.component.html',
  styleUrls: ['./tongquan.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TongquanComponent implements OnInit {
  homnay: Date;
  CUser: User;
  Tasks: any;
  filterTasks: any;
  Duans: any;
  Danglam : any;
  Quahan : any;
  Hoanthanh : any;
  typethamgia: any;
  Phongban:any;
  Khoi:any;
  Congty:any;
  Bophan:any;
  Vitri:any;
  Chinhanh:any;
  Nhanviens:any[]=[];
  constructor(
    private _userService: UserService,
    private _quanlycongviecService: QuanlycongviecService,
    private _quanlycongviecComponent: QuanlycongviecComponent,
    private _cauhinhService: CauhinhService,
    private _nhanvienService: NhanvienService,

  ) {
    this._userService.user$.subscribe((data) => this.CUser = data);
    this._quanlycongviecService.getDuans(),
    this._quanlycongviecService.getBoards(),
    this._quanlycongviecService.duans$.subscribe((data) => 
   {
     console.log(data);
     
     this.Duans = data.filter(v=>v.idTao==this.CUser.id ||v.Thamgia.some(v1=>v1==this.CUser.id))
   }
    );
  }
  ngOnInit(): void {
    this._quanlycongviecService.tasks$.subscribe((data) =>
    {
      if(data)
      {
      this.Tasks = this.filterTasks = data.filter(v=>v.idTao==this.CUser.id ||v.Thuchien==this.CUser.id);
      this.Danglam = this.Tasks.filter(v => v.Trangthai == 1)
      this.Quahan = this.Tasks.filter(v => v.Trangthai == 1)
      this.Hoanthanh = this.Tasks.filter(v => v.Trangthai == 2)
      }
    });
    this.homnay = new Date();
    this.typethamgia = ["Thường Xuyên", "Gần Đây", "Yêu Thích",]
    this.FilterTask(0);
    this._cauhinhService.Cauhinhs$.subscribe((data: Cauhinh[]) => {
         this.Phongban = data.find(v=>v.id =="1eb67802-1257-4cc9-b5f6-5ebc3c3e8e4d").detail;
         this.Khoi = data.find(v=>v.id =="295ec0c7-3d76-405b-80b9-7819ea52831d").detail;
         this.Congty = data.find(v=>v.id =="bf076b63-3a2c-47e3-ab44-7f3c35944369").detail;
         this.Bophan = data.find(v=>v.id =="d0694b90-6b8b-4d67-9528-1e9c315d815a").detail;
         this.Vitri = data.find(v=>v.id =="ea424658-bc53-4222-b006-44dbbf4b5e8b").detail;
         this.Chinhanh = data.find(v=>v.id =="6e2ea777-f6e8-4738-854b-85e60655f335").detail;
    });
    this._nhanvienService.nhanviens$.subscribe((nhanvien) => {
      this.Nhanviens = nhanvien;          
    });
  }
  FilterTask(value)
  {    
    this.filterTasks = this.Tasks.filter(v=>v.Trangthai == parseInt(value));
    console.log(this.filterTasks);
  }
  MenuToggle()
  {
     this._quanlycongviecComponent.matDrawerMenu.toggle();
  }
}