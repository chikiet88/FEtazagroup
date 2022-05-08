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
import { ChitietComponent } from './dauviec/chitiet/chitiet.component';
import { CustomModule } from 'app/pipes/custom/custom.module';
import { FindbyidModule } from 'app/pipes/findbyid/findbyid.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DetailComponent } from './duan/detail/detail.component';
import { DialogComponent } from './duan/dialog/dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseMasonryModule } from '@fuse/components/masonry';
import { SharedModule } from 'app/shared/shared.module';
import { TimkiemModule } from 'app/pipes/timkiem/timkiem.module';
import { GoogleChartsModule } from 'angular-google-charts';
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

        },
        {
          path     : 'duan',
          component: DuanComponent,

        },
        {
          path     : 'duan/:id',
          component: DetailComponent,
        },
    ]
  }
];
@NgModule({
  declarations: [QuanlycongviecComponent,TongquanComponent,MuctieuComponent,DauviecComponent, DuanComponent, ChitietComponent, DetailComponent, DialogComponent],
  imports: [
    GoogleChartsModule,
    CKEditorModule,
    FindbyidModule,
    TimkiemModule,
    CustomModule,
    FuseCardModule,
    MaterialExampleModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatSidenavModule,
    FuseMasonryModule,
    SharedModule,
    QuanlycongviecRoutingModule,
    RouterModule.forChild(quanlycongviecRoutes),
  ]
})
export class QuanlycongviecModule { }
