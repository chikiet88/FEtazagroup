import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Route, RouterModule } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CustomModule } from 'app/pipes/custom/custom.module';
import { FindbyidModule } from 'app/pipes/findbyid/findbyid.module';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialExampleModule } from 'material.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { QuanlyadsComponent } from './quanlyads.component';
import { TaikhoanadsComponent } from './taikhoanads/taikhoanads.component';
import { ChiendichadsComponent } from './chiendichads/chiendichads.component';
import { NhomquangcaoadsComponent } from './nhomquangcaoads/nhomquangcaoads.component';
import { QuangcaoadsComponent } from './quangcaoads/quangcaoads.component';
export const QuanlyadsRoutes: Route[] = [
  {
      path: '',
      component: QuanlyadsComponent,
        children: [
            { 
              path: 'dashboard', component: DashboardComponent,
              // resolve:{data:DaotaoResolver}
            },
            { path: 'taikhoan', component: TaikhoanadsComponent },
            { path: 'chiendich', component: ChiendichadsComponent },
            { path: 'nhomquangcao', component: NhomquangcaoadsComponent },
            { path: 'quangcao', component: QuangcaoadsComponent },
        ],
  },
];
@NgModule({
  declarations: [
    DashboardComponent,
    TaikhoanadsComponent,
    ChiendichadsComponent,
    NhomquangcaoadsComponent,
    QuangcaoadsComponent
  ],
  imports: [
    RouterModule.forChild(QuanlyadsRoutes),
    CommonModule,
    MatButtonModule,
    MatIconModule,
    SharedModule,
    MaterialExampleModule,
    CKEditorModule,
    ReactiveFormsModule,
    FormsModule,
    CustomModule,
    FindbyidModule,
    NgxDropzoneModule,
  ]
})
export class QuanlyadsModule { }
