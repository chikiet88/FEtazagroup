import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { MaterialExampleModule } from 'material.module';
import { DashboardtuyendungComponent } from './dashboardtuyendung.component';
const dashboardRoutes: Route[] = [
  {
      path     : '',
      component: DashboardtuyendungComponent,
  }
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialExampleModule,
    RouterModule.forChild(dashboardRoutes),
  ]
})
export class DashboardtuyendungModule { }
