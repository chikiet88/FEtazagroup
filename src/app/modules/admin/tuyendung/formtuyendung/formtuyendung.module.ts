import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormtuyendungComponent } from './formtuyendung.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialExampleModule } from 'material.module';
const formTuyendungRoutes: Route[] = [
  {
      path     : '',
      component: FormtuyendungComponent,
  }
];
@NgModule({
  declarations: [FormtuyendungComponent],
  imports: [
    CommonModule,
    MaterialExampleModule,
    RouterModule.forChild(formTuyendungRoutes),
  ]
})
export class FormtuyendungModule { }
