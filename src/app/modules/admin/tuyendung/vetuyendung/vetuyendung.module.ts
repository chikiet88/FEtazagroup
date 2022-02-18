import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VetuyendungComponent } from './vetuyendung.component';
import { Route, Router, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseMasonryModule } from '@fuse/components/masonry';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { DetailsComponent } from './details/details.component';
const VetuyendungRoutes: Route[] = [
  {
      path     : '',
      component: VetuyendungComponent,
      children : [
          {
              path     : '',
              component: ListComponent,
              children : [
                  {
                      path         : ':id',
                      component    : DetailsComponent,
                      canDeactivate: []
                  }
              ]
          }
      ]
  }
];
@NgModule({
  declarations: [VetuyendungComponent, ListComponent,DetailsComponent],
  imports: [
    RouterModule.forChild(VetuyendungRoutes),
    CommonModule,
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
    MatTooltipModule,
    SharedModule,
    MatTabsModule
  ]
})
export class VetuyendungModule { }
