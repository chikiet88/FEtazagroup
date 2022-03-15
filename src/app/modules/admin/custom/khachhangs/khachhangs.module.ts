import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KhachhangsComponent } from './khachhangs.component';
import { Route, RouterModule } from '@angular/router';
import { API_KEY, GoogleSheetsDbService } from 'ng-google-sheets-db';
import { environment } from 'environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialExampleModule } from 'material.module';
import { KhachhangsResolver } from './khachhangs.resolver';
const khachhangsRoutes: Route[] = [
  {
      path     : '',
      component: KhachhangsComponent,
      resolve  : {
        tasks    : KhachhangsResolver,
    },
  }
];
@NgModule({
  declarations: [KhachhangsComponent],
  imports: [
    HttpClientModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(khachhangsRoutes),
  ],
  providers: [
    {
      provide: API_KEY,
      useValue: environment.googleSheetsApiKey,
    },
    GoogleSheetsDbService
  ],
})
export class KhachhangsModule { }
