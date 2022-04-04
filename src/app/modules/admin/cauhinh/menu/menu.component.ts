import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
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
  CRUD:number;
  constructor(
    private _fb:FormBuilder,
    private _cauhinhService:CauhinhService
    ) { }

  ngOnInit(): void {
    this.CRUD = 0;
    this._cauhinhService.Menus$.subscribe((data)=>{ 
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
  EditMenu(item)
  {
    this.CRUD=1;
    this.MenuForm.patchValue(item);
    this.MenuForm.addControl('uuid', new FormControl(item.uuid));
  }
  CancelMenu()
  {
    this.CRUD=0;
    this.MenuForm.reset()
  }
  UpdateMenu()
  {
    this.menu = this.MenuForm.getRawValue();
    this._cauhinhService.UpdateMenu(this.menu).subscribe();
    this.ngOnInit();
  }
}
