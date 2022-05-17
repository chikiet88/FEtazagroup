import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { QuanlycongviecService } from '../quanlycongviec.service';

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
  Duans: any;
  Danglam : any;
  Quahan : any;
  Hoanthanh : any;
  typethamgia: any;
  constructor(
    private _userService: UserService,
    private _quanlycongviecService: QuanlycongviecService,

  ) {
    this._userService.user$.subscribe((data) => this.CUser = data);
    this._quanlycongviecService.getDuans(),
    this._quanlycongviecService.getBoards(),
    this._quanlycongviecService.duans$.subscribe((data) => 
   {
     this.Duans = data.filter(v=>v.idTao==this.CUser.id ||v.Thamgia==this.CUser.id)
   }
    );
  }
  ngOnInit(): void {
    this._quanlycongviecService.tasks$.subscribe((data) =>
    {
      if(data)
      {
      this.Tasks = data.filter(v=>v.idTao==this.CUser.id ||v.Thuchien==this.CUser.id);
      this.Danglam = this.Tasks.filter(v => v.Trangthai == 1)
      this.Quahan = this.Tasks.filter(v => v.Trangthai == 1)
      this.Hoanthanh = this.Tasks.filter(v => v.Trangthai == 2)
      }
    });
    this.homnay = new Date();
    this.typethamgia = ["Thường Xuyên", "Gần Đây", "Yêu Thích",]
  }
}