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
  flatToNested = new FlatToNested();
  MenuForm:FormGroup;
  menus:Menu[];
  constructor(
    private _fb:FormBuilder,
    private _cauhinhService:CauhinhService
    ) { }

  ngOnInit(): void {
    this._cauhinhService.Menus$.subscribe((data)=>{ 
      console.log(data);
        this.menus = data;
        const nest = (items, id = '', link = 'parent') => items.filter(item => item[link] == id).map(item => ({
          ...item,
          children: nest(items, item.uuid)
        }));
        console.log(nest(data));
      }
    )
    this.MenuForm = this._fb.group({
      title:[''],
      id:['wellcome.cauhoi'],
      Type:[''],
      icon:['heroicons_outline:clipboard-check'],
      Link:['/wellcome/cauhoi'],
      parent:[''],
    })
  }
}
