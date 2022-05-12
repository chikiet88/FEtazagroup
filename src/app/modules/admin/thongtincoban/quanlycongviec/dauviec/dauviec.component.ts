import { Component, OnInit, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-dauviec',
  templateUrl: './dauviec.component.html',
  styleUrls: ['./dauviec.component.scss'],
  encapsulation:ViewEncapsulation.None,
})
export class DauviecComponent implements OnInit {
  view:any ;
  constructor() { }

  ngOnInit(): void {
    this.view = 1;
  }
  chosenView(view)
  {
    this.view = view;
  }

}