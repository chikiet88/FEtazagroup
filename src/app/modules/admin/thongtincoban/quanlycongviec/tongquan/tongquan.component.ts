import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-tongquan',
  templateUrl: './tongquan.component.html',
  styleUrls: ['./tongquan.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class TongquanComponent implements OnInit {
  homnay:Date;
  thisUser:User;
  typethamgia:any;
  constructor( 
      private _userService:UserService
    
  ) {
    this._userService.user$.subscribe((data)=>this.thisUser = data);
    }
  ngOnInit(): void {
    this.homnay = new Date();
    this.typethamgia = ["Thường Xuyên","Gần Đây","Yêu Thích",]
    
  }
}