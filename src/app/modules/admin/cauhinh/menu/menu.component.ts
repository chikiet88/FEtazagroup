import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CauhinhService } from '../cauhinh.service';
import { Menu } from '../cauhinh.types';
const FlatToNested = require('flat-to-nested');
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  flatToNested = new FlatToNested({id: 'uuid',	parent: 'parent',children:'children'});
  MenuForm:FormGroup;
  menus:Menu[];
  constructor(
    private _fb:FormBuilder,
    private _cauhinhService:CauhinhService
    ) { }

  ngOnInit(): void {
    this._cauhinhService.getMenus().subscribe();
    this._cauhinhService.Menus$.subscribe((data)=>{ 
      console.log(data);
      var nested = this.flatToNested.convert(data);
      console.log(nested);
        this.menus = data;
      }
    )
    this.MenuForm = this._fb.group({
      title:[''],
      parent:[''],
    })
  }
}
