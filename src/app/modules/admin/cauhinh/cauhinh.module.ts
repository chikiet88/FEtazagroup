import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
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
import { CauhinhComponent } from './cauhinh.component';
import { ListComponent } from './list/list.component';
import { EditcauhinhComponent } from './editcauhinh/editcauhinh.component';
const CauhinhRoutes: Route[] = [
  {
      path     : '',
      component: CauhinhComponent,
      children : [
        {
            path     : '',
            component: ListComponent
        }
    ]
  }
];


@NgModule({
  declarations: [
       ListComponent,
       EditcauhinhComponent,
  ],
  imports: [
    RouterModule.forChild(CauhinhRoutes),
    CommonModule,
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
    SharedModule
  ]
})
export class CauhinhModule { }
