import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { NhanvienService } from '../../baocao/nhanvien/nhanvien.service';
import { Nhanvien } from '../../baocao/nhanvien/nhanvien.type';
import { TestingService } from './testing.service';
// const v1lichhop = require('app/v1json/lichhop.json');
// const v1loai = require('app/v1json/loaihinhhop.json');
// const v1nhanvien = require('app/v1json/nhanvien.json');
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
  nhanviens:Nhanvien[];
  user:User;
  noti:any;
  constructor(
    private _formBuilder:FormBuilder,
    private _userService:UserService,
    private _nhanvienService:NhanvienService,
    private _testingService:TestingService
  ) {}

  ngOnInit(): void {

    this._userService.user$.subscribe((data)=>
    {
        this.user = data
    })
    this._nhanvienService.getNhanviens().subscribe();
    this._nhanvienService.nhanviens$.subscribe((data)=>{ this.nhanviens = data 
    console.log(data);
    });
    this.notification = this._formBuilder.group({
      idTo         : [''],
      idFrom       : [this.user.id],
      Tieude        : [''],
      Noidung      : [''], 
      Lienket         : [''],
    })
  }
  CreateNoti()
  {
    this.noti = this.notification.getRawValue();
    this._testingService.CreateNoti(this.noti).subscribe((data) => {
        console.log(data)
    });
  }


}
