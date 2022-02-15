import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HosotuyendungComponent } from './hosotuyendung.component';
import { Route, Router, RouterModule } from '@angular/router';

const HosotuyendungRoutes: Route[] = [
  {
      path     : '',
      component: HosotuyendungComponent,
  }
];


@NgModule({
  declarations: [HosotuyendungComponent],
  imports: [
    RouterModule.forChild(HosotuyendungRoutes),
    CommonModule
  ]
})
export class HosotuyendungModule { }
