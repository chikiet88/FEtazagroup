import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KhtimonaComponent } from './khtimona.component';
import { Route, RouterModule } from '@angular/router';
import { API_KEY, GoogleSheetsDbService } from 'ng-google-sheets-db';
import { environment } from 'environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialExampleModule } from 'material.module';
import { KhtimonaResolver } from './khtimona.resolver';
import { MatTableExporterModule } from 'mat-table-exporter';
const khtimonaRoutes: Route[] = [
  {
      path     : '',
      component: KhtimonaComponent,
      resolve  : {
        tasks    : KhtimonaResolver,
    },
  }
];
@NgModule({
  declarations: [KhtimonaComponent],
  imports: [
    MatTableExporterModule,
    HttpClientModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(khtimonaRoutes),
  ],
  providers: [
    {
      provide: API_KEY,
      useValue: environment.googleSheetsApiKey,
    },
    GoogleSheetsDbService
  ],
})
export class KhtimonaModule { }
