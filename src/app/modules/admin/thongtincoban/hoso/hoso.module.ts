import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HosoComponent } from './hoso.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialExampleModule } from 'material.module';
import { HosoAccountComponent } from './account/account.component';
import { HosoNotificationsComponent } from './notifications/notifications.component';
import { HosoSecurityComponent } from './security/security.component';
import { HosoPlanBillingComponent } from './plan-billing/plan-billing.component';
import { HosoTeamComponent } from './team/team.component';
const HosoRoutes: Routes = [
  {
      path  : '',
      component: HosoComponent,           
  }
];

@NgModule({
  declarations: [
    HosoComponent,
    HosoAccountComponent,
    HosoNotificationsComponent,
    HosoSecurityComponent,
    HosoPlanBillingComponent,
    HosoTeamComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(HosoRoutes),
    MaterialExampleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    FuseAlertModule,
    SharedModule
  ]
})
export class HosoModule { }
