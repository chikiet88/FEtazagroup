import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhanvienComponent } from './nhanvien.component';
import { Route, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MaterialExampleModule } from 'material.module';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { NhanviensCauhinhResolver, NhanviensNhanvienResolver, NhanviensResolver } from './nhanvien.resolvers';
import { CanDeactivateNhanviensDetails } from './nhanvien.guards';
import { NhanvienService } from './nhanvien.service';
const nhanvienRoutes: Route[] = [
  {
      path     : '',
      component: NhanvienComponent,
      children : [
        {
            path     : '',
            component: ListComponent,
            resolve  : {
                tasks    : NhanviensResolver,
                cauhinhs :NhanviensCauhinhResolver,
            },
            children : [
                {
                    path         : ':id',
                    component    : DetailsComponent,
                    resolve      : {
                       task     : NhanviensNhanvienResolver,
                       cauhinhs :NhanviensCauhinhResolver,
                    },
                    canDeactivate: [CanDeactivateNhanviensDetails]
                }
            ]
        }
    ]

  }
];
@NgModule({
  declarations: [
    ListComponent,
    DetailsComponent,
    NhanvienComponent,
  ],
  imports: [
    RouterModule.forChild(nhanvienRoutes),
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressBarModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatTooltipModule,
    FuseFindByKeyPipeModule,
  ],
})
export class NhanvienModule { }
