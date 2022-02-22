import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { ThongkekhComponent } from './thongkekh.component';
import { MaterialExampleModule } from 'material.module';
const thongkeRoutes: Route[] = [
  {
      path     : '',
      component: ThongkekhComponent,

  }
];
@NgModule({
  declarations: [],
  imports: [
    MaterialExampleModule,
    RouterModule.forChild(thongkeRoutes),
    CommonModule,
  ]
})
export class ThongkekhModule { }
