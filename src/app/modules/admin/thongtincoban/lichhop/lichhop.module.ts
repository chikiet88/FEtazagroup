import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { LichhopComponent } from './lichhop.component';
import { RouterModule, Routes } from '@angular/router';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MaterialExampleModule } from 'material.module';
registerLocaleData(localeVi);
const LichhopRoutes: Routes = [
  {
      path  : '',
      component: LichhopComponent,
  }
];

@NgModule({
  declarations: [LichhopComponent],
  imports: [
    MaterialExampleModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    RouterModule.forChild(LichhopRoutes),
    CommonModule,
  ]
})
export class LichhopModule { }
