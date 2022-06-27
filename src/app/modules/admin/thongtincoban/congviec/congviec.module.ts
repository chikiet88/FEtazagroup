import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CongviecComponent } from './congviec.component';
import { Route, RouterModule } from '@angular/router';
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
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(congviecRoutes),
  ]
})
export class CongviecModule { }
