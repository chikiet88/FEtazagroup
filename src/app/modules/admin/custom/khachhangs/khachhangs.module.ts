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
import { MatTableExporterModule } from 'mat-table-exporter';
import { TazaskinComponent } from './tazaskin/tazaskin.component';
import { TimonaComponent } from './timona/timona.component';
const khachhangsRoutes: Route[] = [
  {
      path     : '',
      component: KhachhangsComponent,
      children:[
        {
          path     : 'timona',
          component: TimonaComponent,
          resolve  : {
            tasks    : KhachhangsResolver,
           },
        },
        {
          path     : 'tazaskin',
          component: TazaskinComponent,
          resolve  : {
            tasks    : KhachhangsResolver,
           },
        }
      ],
      resolve  : {
        tasks    : KhachhangsResolver,
    },
  }
];
@NgModule({
  declarations: [KhachhangsComponent, TazaskinComponent, TimonaComponent],
  imports: [
    MatTableExporterModule,
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
