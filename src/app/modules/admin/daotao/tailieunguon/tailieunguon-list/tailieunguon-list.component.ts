import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
@Component({
    selector: 'app-tailieunguon-list',
    templateUrl: './tailieunguon-list.component.html',
    styleUrls: ['./tailieunguon-list.component.scss'],
})
export class TailieunguonListComponent implements OnInit {
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

    constructor() {}
    ngOnInit() {}
}
