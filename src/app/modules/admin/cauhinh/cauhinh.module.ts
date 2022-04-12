import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseMasonryModule } from '@fuse/components/masonry';
import { SharedModule } from 'app/shared/shared.module';
import { CauhinhComponent } from './cauhinh.component';
import { EditcauhinhComponent } from './editcauhinh/editcauhinh.component';
import { MenuComponent } from './menu/menu.component';
import { CaidatchungComponent } from './caidatchung/caidatchung.component';
import { MaterialExampleModule } from 'material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CauhinhMenuResolver } from './cauhinh.resolver';
import { DanhmucComponent } from './danhmuc/danhmuc.component';
const CauhinhRoutes: Route[] = [
  {
      path     : '',
      component: CauhinhComponent,
      children : [
        {
            path     : 'menu',
            component: MenuComponent,
            resolve:{
              tasks:CauhinhMenuResolver
            }
        },
        {
            path     : 'danhmuc',
            component: DanhmucComponent,
            resolve:{
              tasks:CauhinhMenuResolver
            }
        },
        {
            path     : 'caidat',
            component: CaidatchungComponent
        }
    ]
  }
];


@NgModule({
  declarations: [
       MenuComponent,
       EditcauhinhComponent,
       CaidatchungComponent,
       DanhmucComponent,
  ],
  imports: [
    RouterModule.forChild(CauhinhRoutes),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialExampleModule,
    MatOptionModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatSidenavModule,
    FuseMasonryModule,
    SharedModule
  ]
})
export class CauhinhModule { }
