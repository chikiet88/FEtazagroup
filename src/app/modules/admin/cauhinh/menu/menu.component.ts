import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { cloneDeep } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { NhanvienService } from '../../baocao/nhanvien/nhanvien.service';
import { Nhanvien } from '../../baocao/nhanvien/nhanvien.type';
import { CauhinhService } from '../cauhinh.service';
import { Cauhinh, Menu } from '../cauhinh.types';
const FlatToNested = require('flat-to-nested');
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  MenuForm:FormGroup;
  menus:Menu[];
  menu:Menu;
  CRUD:number;
  Chinhanh: any;
  PQChinhanh:any;
  PQMenu:any;
  Menu:any;
  formGroup: FormGroup;
  nhanviens: Nhanvien[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild("toggleElement") ref: ElementRef;
  constructor(
    private _fb:FormBuilder,
    private _cauhinhService:CauhinhService,
    private _nhanvienService:NhanvienService,
    private _changeDetectorRef: ChangeDetectorRef,
    ) {}

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
    this._cauhinhService.Cauhinhs$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: Cauhinh[]) => {
      this.Chinhanh = data.find(v=>v.id =="6e2ea777-f6e8-4738-854b-85e60655f335").detail;
         this.PQChinhanh = cloneDeep(this.Chinhanh);
         Object.keys(this.PQChinhanh).forEach(key => {
             this.PQChinhanh[key] = false;
           });
        this._changeDetectorRef.markForCheck();
    });
    this._cauhinhService.Menus$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data) => {
        console.log(data);
         this.Menu = data;
         this.PQMenu = {};
         data.forEach(v => {
             this.PQMenu[v.uuid]=v.status;
           });
        this._changeDetectorRef.markForCheck();
    }); 
  this._nhanvienService.nhanviens$
  .pipe(takeUntil(this._unsubscribeAll))
  .subscribe((nhanviens: Nhanvien[]) => {               
      this.nhanviens = nhanviens;
      this._changeDetectorRef.markForCheck();
  });
  }
  Changetatus(item,e) {   
      item.status = e.checked;
       this._cauhinhService.UpdateMenu(item).subscribe(); 
      this.nhanviens.forEach(v => {
          v.Menu[item.uuid] = e.checked;
        this._nhanvienService.updateNhanvien(v.id,v).subscribe();
      }); 
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
    console.log(this.menu);
    
    this.ngOnInit();
  }
}
