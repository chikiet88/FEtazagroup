import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-quanlycongviec',
  templateUrl: './quanlycongviec.component.html',
  styleUrls: ['./quanlycongviec.component.scss']
})
export class QuanlycongviecComponent implements OnInit {
  MenuCongviec: any[] = [
    {title:'Tổng Quan',link:''},
    {title:'Đầu Việc',link:'dauviec'},
    {title:'Dự Án',link:'duan'},
    {title:'Mục Tiêu',link:'muctieu'}];
   ngOnInit(): void {
  
   } 
}
