import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { ThongkekhComponent } from './thongkekh.component';
import { MaterialExampleModule } from 'material.module';
import { API_KEY, GoogleSheetsDbService } from 'ng-google-sheets-db';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
const thongkeRoutes: Route[] = [
  {
      path     : '',
      component: ThongkekhComponent,

  }
];
@NgModule({
  declarations:  [ThongkekhComponent],
  imports: [
    HttpClientModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    RouterModule.forChild(thongkeRoutes),
    CommonModule,
  ],
  providers: [
    {
      provide: API_KEY,
      useValue: environment.googleSheetsApiKey,
    },
    GoogleSheetsDbService
  ],
})
export class ThongkekhModule { }
