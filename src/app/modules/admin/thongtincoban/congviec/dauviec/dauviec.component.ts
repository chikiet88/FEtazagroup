import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { QuanlycongviecComponent } from '../quanlycongviec.component';
@Component({
  selector: 'app-dauviec',
  templateUrl: './dauviec.component.html',
  styleUrls: ['./dauviec.component.scss'],
  encapsulation:ViewEncapsulation.None,
})
export class DauviecComponent implements OnInit {
  view:any ;
  listview:any;
  constructor(
    private _quanlycongviecComponent: QuanlycongviecComponent
  ) { }

  ngOnInit(): void {
    this.listview = [
      {id:1,value:'view_kanban'},
     // {id:2,value:'view_list'},
      {id:3,value:'view_timeline'},
      //{id:4,value:'calendar_month'},
    ]
    this.view = 1;
  }
  chosenView(view)
  {
    this.view = view;
  }
  MenuToggle()
  {
     this._quanlycongviecComponent.matDrawerMenu.toggle();
  }
  

}
