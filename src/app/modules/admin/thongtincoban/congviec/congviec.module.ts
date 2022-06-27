import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CongviecComponent } from './congviec.component';
import { Route, RouterModule } from '@angular/router';
import { CongviecboardComponent } from './congviecboard/congviecboard.component';
import { MaterialExampleModule } from 'material.module';
import { AddcardComponent } from './congviecboard/addcard/addcard.component';
import { AddlistComponent } from './congviecboard/addlist/addlist.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SharedModule } from 'app/shared/shared.module';
import { QuanlycongviecComponent } from '../quanlycongviec/quanlycongviec.component';
const congviecRoutes: Route[] = [
  {
    path: '',
    component: CongviecComponent,
    // children: [
    //   {
    //     path: 'tongquan',
    //     component: TongquanComponent,
    //   },
    // ]
  }
];


@NgModule({
  declarations: [
    CongviecComponent,
    CongviecboardComponent,
    AddcardComponent,
    AddlistComponent,
  ],
  imports: [
    MaterialExampleModule,
    CommonModule,
    RouterModule.forChild(congviecRoutes),
    SharedModule,
    CKEditorModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class CongviecModule { }
