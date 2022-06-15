import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { Observable } from 'rxjs';
import { NhanvienService } from '../../baocao/nhanvien/nhanvien.service';
import { Nhanvien, profile } from '../../baocao/nhanvien/nhanvien.type';
import { Khachhang } from '../khachhangs/khachhang.type';
import { KhachhangsService } from '../khachhangs/khachhangs.service';
import { TestingService } from './testing.service';
// const v1lichhop = require('app/v1json/lichhop.json');
// const v1loai = require('app/v1json/loaihinhhop.json');
// const v1nhanvien = require('app/v1json/nhanvien.json');s
// const congty = require('app/v1json/congty.json');
//const v2nhanvien = require('app/v1json/v2nhanvien.json');
//console.log(v1nhanvien); 
// let x= []
// v1lichhop.forEach(v => {
// v.Congty = congty.detail[v.Congty];
// });
// console.log(x);
// Nối 2 Array
// const profiles = {};
// function addToProfiles(arr, profiles) {
//   for (let obj of arr) {
//     if (obj.SDT != null) {
//       const profile = profiles[obj.SDT] || {};
//       profiles[obj.SDT] = { ...profile, ...obj };
//     }
//   }
// }
// addToProfiles(v1nhanvien, profiles);
// addToProfiles(v2nhanvien, profiles);
// const third = Object.values(profiles);
// console.log(third);
//  v1lichhop.forEach(v => {
//    v.idLoaihinh = v1loai.detail[v.idLoaihinh];
//  });

// const x ={};
// console.log(Object.entries(congty.detail));
// Object.entries(congty.detail).forEach((v) => {
//   const key = ""+v[1];
//   const obj = {[key]:v[0]};
//   Object.assign(x, obj);
// });
// console.log(x);
@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})

export class TestingComponent implements OnInit {
  notification: FormGroup;
  nhanviens:any;
  user:User;
  profile:profile;
  noti:any;
  data$: Observable<Khachhang[]>;
  constructor(
    private _formBuilder:FormBuilder,
    private _userService:UserService,
    private _nhanvienService:NhanvienService,
    private _testingService:TestingService,
    private _khachhangsService: KhachhangsService,
  ) {}
  @ViewChild('DataPag', { static: false }) DataPag: MatPaginator;
  @ViewChild('DataSort', { static: false }) DataSort: MatSort;
  UniData:any
  url:any
  ngOnInit(): void {
    this.url = "https://trello.com";
    this._userService.user$.subscribe((data)=>
    {
        this.user = data
    })
    this._nhanvienService.getNhanviens().subscribe();
    this._nhanvienService.nhanviens$.subscribe((data)=>{ 
      this.nhanviens = data.filter(v=> v.id == '763cf5b9-8878-4db7-b727-6c8644f68ef9');
      console.log();
      
      console.log(data);
      // data.forEach(v => {
      //   const x = {
      //     idUser: v.id,
      //     Congty: v.profile['Congty'],
      //     Khoi: v.profile['Khoi'],
      //     Phongban: v.profile['Phongban'],
      //     Vitri: v.profile['Vitri'],
      //     MaNV: v.profile['MaNV'],
      //     CMND: v.profile['CMND'],
      //     Ngaysinh: new Date(v.profile['Ngaysinh']),
      //     Ngayvao: new Date(v.profile['Datein']),
      //     Ngaynghi:new Date(v.profile['Dateout']),
      //     Diachi: v.profile['Diachi'],
      //     Facebook: v.profile['Facebook'],
      //     Zalo: v.profile['Zalo'],
      //     Trangthai: v.profile['TTLV'],
      //     idTao: this.user['id'],
      //   }      
      //   console.log(x);
      //      this._nhanvienService.createProfile(x).subscribe();
      // });      
    });
    this.notification = this._formBuilder.group({
      idTo         : [''],
      idFrom       : [this.user.id],
      Tieude        : [''],
      Noidung      : [''], 
      Lienket         : [''],
    })
  }
  SetTrelloURL(e)
  {
    console.log(e);
    
  }
  CreateNoti()
  {
    this.noti = this.notification.getRawValue();
    this._testingService.CreateNoti(this.noti).subscribe((data) => {
        console.log(data)
    });
  }

  


}
