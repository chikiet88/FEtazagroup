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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CanDeactivateVetuyendungsDetails } from './vetuyendung.guard';
import { VetuyendungResolver, VetuyendungsResolver } from './vetuyendung.resolver';
import { MatSelectModule } from '@angular/material/select';
import {MatBadgeModule} from '@angular/material/badge';
import { EditorModule } from '@tinymce/tinymce-angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
const VetuyendungRoutes: Route[] = [
  {
      path     : '',
      component: VetuyendungComponent,
      children : [
          {
              path     : '',
              component: ListComponent,
              resolve  : {
                tasks    : VetuyendungsResolver,
              },
              children : [
                  {
                      path         : ':id',
                      component    : DetailsComponent,
                      resolve  : {
                        tasks    : VetuyendungResolver,
                      },
                      canDeactivate: [CanDeactivateVetuyendungsDetails]
                  }
              ]
          }
      ]
  }
];
@NgModule({
  declarations: [VetuyendungComponent, ListComponent,DetailsComponent],
  imports: [
    DragDropModule,
    MatBadgeModule,
    EditorModule,
    RouterModule.forChild(VetuyendungRoutes),
    CommonModule,
    MatButtonToggleModule,
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
    MatSelectModule,
    SharedModule,
    MatTabsModule,
  ]
})
export class VetuyendungModule { }
