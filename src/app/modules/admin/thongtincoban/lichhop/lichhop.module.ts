import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LichhopComponent } from './lichhop.component';
import { RouterModule, Routes } from '@angular/router';
const LichhopRoutes: Routes = [
  {
      path  : '',
      component: LichhopComponent,
  }
];
@NgModule({
  declarations: [LichhopComponent],
  imports: [
    RouterModule.forChild(LichhopRoutes),
    CommonModule,
  ]
})
export class LichhopModule { }
