import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-quanlycongviec',
  templateUrl: './quanlycongviec.component.html',
  styleUrls: ['./quanlycongviec.component.scss']
})
export class QuanlycongviecComponent implements OnInit {
  MenuCongviec: any[] = [
    {title:'Tổng Quan',link:'tongquan'},
    {title:'Dự Án',link:'duan'},
    {title:'Đầu Việc',link:'dauviec'},
    {title:'Mục Tiêu',link:'muctieu'}
  ];
   ngOnInit(): void {
  
   } 
}
