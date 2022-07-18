import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-folder-list',
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.scss']
})
export class FolderListComponent implements OnInit {
  isFolder= false
  isFile = false
  title = 'Tất cả các Folder và File';
  type = 'PieChart';
  data = [
     ['Sửa lại', 45.0],
     ['Phê duyệt', 45],
     ['Chưa xem', 10],
  
  ];
  columnNames = ['Browser', 'Percentage'];
  options = {          
  };
  width = 550;
  height = 400;

  constructor() { }

  ngOnInit(): void {
  }

}
