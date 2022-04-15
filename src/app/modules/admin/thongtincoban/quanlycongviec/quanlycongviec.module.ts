import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuanlycongviecRoutingModule } from './quanlycongviec-routing.module';
import { Route, RouterModule } from '@angular/router';
import { QuanlycongviecComponent } from './quanlycongviec.component';
import { MaterialExampleModule } from 'material.module';
import { FuseCardModule } from '@fuse/components/card';
import { TongquanComponent } from './tongquan/tongquan.component';
import { MuctieuComponent } from './muctieu/muctieu.component';
import { DauviecComponent } from './dauviec/dauviec.component';
import { DuanComponent } from './duan/duan.component';
const quanlycongviecRoutes: Route[] = [
  {
      path     : '',
      component: QuanlycongviecComponent,
      children : [
        {
            path     : '',
            component: TongquanComponent,
        },
        {
          path     : 'muctieu',
          component: MuctieuComponent,
        },
        {
          path     : 'dauviec',
          component: DauviecComponent,
        }
    ]
  }
];
@NgModule({
  declarations: [QuanlycongviecComponent,TongquanComponent,MuctieuComponent,DauviecComponent, DuanComponent],
  imports: [
    FuseCardModule,
    MaterialExampleModule,
    CommonModule,
    QuanlycongviecRoutingModule,
    RouterModule.forChild(quanlycongviecRoutes),
  ]
})
export class QuanlycongviecModule { }
