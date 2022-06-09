import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Route, RouterModule } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FindbyidModule } from 'app/pipes/findbyid/findbyid.module';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialExampleModule } from 'material.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TooltipModule } from 'ng2-tooltip-directive';
import { CauhoithuonggapComponent } from './cauhoithuonggap.component';
import { CauhoithuonggapResolver } from './cauhoithuonggap.resolver';
export const cauhoiRoutes: Route[] = [
  {
      path: '',
      component: CauhoithuonggapComponent,
      resolve: {
          data: CauhoithuonggapResolver
      }
  }
];


@NgModule({
  declarations: [CauhoithuonggapComponent],
  imports: [
    TooltipModule,
    CKEditorModule,
    FindbyidModule,
    MaterialExampleModule,
    RouterModule.forChild(cauhoiRoutes),
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    NgApexchartsModule,
    SharedModule,
  ]
})
export class CauhoithuonggapModule { }
