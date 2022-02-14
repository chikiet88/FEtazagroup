import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LichhopComponent } from './lichhop.component';
const LichhopRoutes: Routes = [
  {
      path  : '',
      component: LichhopComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(LichhopRoutes)],
  exports: [RouterModule]
})
export class LichhopRoutingModule { }
