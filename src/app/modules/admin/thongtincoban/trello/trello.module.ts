import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrelloComponent } from './trello.component';
import { Route, RouterModule } from '@angular/router';
import { CustomModule } from 'app/pipes/custom/custom.module';
import { MaterialExampleModule } from 'material.module';
const trelloRoutes: Route[] = [
  {
    path: '',
    component: TrelloComponent,
  }
];
@NgModule({
  declarations: [TrelloComponent],
  imports: [
    RouterModule.forChild(trelloRoutes),
    CommonModule,
    CustomModule,
    MaterialExampleModule,
  ]
})
export class TrelloModule { }
