import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { TailieunguonComponent } from './tailieunguon.component';
import { MaterialExampleModule } from 'material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CustomModule } from 'app/pipes/custom/custom.module';
import { SharedModule } from 'app/shared/shared.module';
export const TailieunguonRoutes: Route[] = [
  {
      path     : '',
      component: TailieunguonComponent
  }
]
@NgModule({
  declarations: [TailieunguonComponent],
  imports: [
    RouterModule.forChild(TailieunguonRoutes),
    CommonModule,
    MatButtonModule,
    MatIconModule,
    SharedModule,
    MaterialExampleModule,
    CKEditorModule,
    ReactiveFormsModule,
    FormsModule,
    CustomModule,
  ]
})
export class TailieunguonModule { }
