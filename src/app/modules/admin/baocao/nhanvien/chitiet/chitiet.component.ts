import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CauhinhService } from 'app/modules/admin/cauhinh/cauhinh.service';
import { Cauhinh } from 'app/modules/admin/cauhinh/cauhinh.types';
import { cloneDeep } from 'lodash';
import { NhanvienService } from '../nhanvien.service';
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];
@Component({
  selector: 'app-chitiet',
  templateUrl: './chitiet.component.html',
  styleUrls: ['./chitiet.component.scss'],
})
export class ChitietComponent implements OnInit {
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataTreeSource = new MatTreeNestedDataSource<FoodNode>();
  CNhanvien: any;
  Phongban: any;
  Khoi: any;
  Congty: any;
  Bophan: any;
  Vitri: any;
  Chinhanh: any;
  PQChinhanh:any;
  PQMenu:any;
  Menu:any;
  PQisDisabled:boolean;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _nhanvienService: NhanvienService,
    private _cauhinhService: CauhinhService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _router: Router,
  ) { 
    this.dataTreeSource.data = TREE_DATA;
  }
  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
  ngOnInit(): void {
    this.PQisDisabled = true;
    this._cauhinhService.Cauhinhs$.subscribe((data: Cauhinh[]) => {
         this.Phongban = data.find(v=>v.id =="1eb67802-1257-4cc9-b5f6-5ebc3c3e8e4d").detail;
         this.Khoi = data.find(v=>v.id =="295ec0c7-3d76-405b-80b9-7819ea52831d").detail;
         this.Congty = data.find(v=>v.id =="bf076b63-3a2c-47e3-ab44-7f3c35944369").detail;
         this.Bophan = data.find(v=>v.id =="d0694b90-6b8b-4d67-9528-1e9c315d815a").detail;
         this.Vitri = data.find(v=>v.id =="ea424658-bc53-4222-b006-44dbbf4b5e8b").detail;
         this.Chinhanh = data.find(v=>v.id =="6e2ea777-f6e8-4738-854b-85e60655f335").detail;
         this.PQChinhanh = cloneDeep(this.Chinhanh);
         Object.keys(this.PQChinhanh).forEach(key => {
             this.PQChinhanh[key] = false;
           });
        this._changeDetectorRef.markForCheck();
    });
    this._cauhinhService.Menus$.subscribe((data) => {
        console.log(data);
         this.Menu = data;
         this.PQMenu = {};
         data.forEach(v => {
             this.PQMenu[v.uuid]=v.status;
           });           
        this._changeDetectorRef.markForCheck();
    });

    this._nhanvienService.nhanvien$.subscribe((nhanvien) => {
        this.CNhanvien = nhanvien;
    }
    )}

}
