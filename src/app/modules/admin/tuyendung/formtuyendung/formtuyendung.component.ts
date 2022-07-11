import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-formtuyendung',
  templateUrl: './formtuyendung.component.html',
  styleUrls: ['./formtuyendung.component.scss']
})
export class FormtuyendungComponent implements OnInit {
  FormDulieu:any;
  constructor() { }

  ngOnInit(): void {
      this.FormDulieu = [
        {id:1,value:'',icon:''},
        {id:2,value:'',icon:''},
        {id:3,value:'',icon:''},
        {id:4,value:'',icon:''},
        {id:5,value:'',icon:''}
      ]
  }

}
