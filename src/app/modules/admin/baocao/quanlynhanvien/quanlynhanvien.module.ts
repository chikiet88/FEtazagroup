import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuanlynhanvienComponent } from './quanlynhanvien.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Route, RouterModule } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FuseCardModule } from '@fuse/components/card';
import { FuseMasonryModule } from '@fuse/components/masonry';
import { GoogleChartsModule } from 'angular-google-charts';
import { CustomModule } from 'app/pipes/custom/custom.module';
import { FindbyidModule } from 'app/pipes/findbyid/findbyid.module';
import { TimkiemModule } from 'app/pipes/timkiem/timkiem.module';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialExampleModule } from 'material.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxDropzoneModule } from 'ngx-dropzone';
export const quanlynhanvencRoutes: Route[] = [
  {
      path     : '',
      component: QuanlynhanvienComponent,
      // resolve  : {
      //     boards: CongviecResolver
      // },
      // children:[
      //   {
      //     path     : ':id',
      //     component: CongviecboardComponent,
      //     resolve  : {
      //         board: CongvecsDuanResolver
      //     },
      //     children : [
      //         {
      //             path     : ':id',
      //             component: EdittaskComponent,
      //             resolve  : {
      //                 card: CongvecsEdittaskResolver
      //             }
      //         }
      //     ]
      // },
      // ]

  },
];

@NgModule({
  declarations: [],
  imports: [
    NgApexchartsModule,
    NgxDropzoneModule,
    GoogleChartsModule,
    CKEditorModule,
    FindbyidModule,
    TimkiemModule,
    CustomModule,
    FuseCardModule,
    MaterialExampleModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatSidenavModule,
    FuseMasonryModule,
    SharedModule,
    MaterialExampleModule,
    CommonModule,
    RouterModule.forChild(quanlynhanvencRoutes),
    SharedModule,
    CKEditorModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class QuanlynhanvienModule { }
