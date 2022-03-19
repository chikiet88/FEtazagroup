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
  menu:Menu;
  constructor(
    private _fb:FormBuilder,
    private _cauhinhService:CauhinhService
    ) { }

  ngOnInit(): void {
    this._cauhinhService.Menus$.subscribe((data)=>{ 
      console.log(data);
        const nest = (items, id = '', link = 'parent') => items.filter(item => item[link] == id).map(item => ({
          ...item,
          children: nest(items, item.uuid)
        }));
        this.menus = data;
      }
    )
    this.MenuForm = this._fb.group({
      title:[''],
      id:['wellcome.cauhoi'],
      type:[''],
      icon:['heroicons_outline:clipboard-check'],
      link:['/wellcome/cauhoi'],
      parent:[''],
    })
  }
  CreateMenu()
  {
    this.menu = this.MenuForm.getRawValue();
    const words = this.menu.id.split('.');
    this.menu.level = words.length;
    this._cauhinhService.CreateMenu(this.menu).subscribe();
  }
}
