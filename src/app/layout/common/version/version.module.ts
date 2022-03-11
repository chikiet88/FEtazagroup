import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VersionComponent } from './version.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';@NgModule({
  declarations: [
    VersionComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    OverlayModule,
    PortalModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    SharedModule
  ],
  exports     : [
    VersionComponent  
  ]
})
export class VersionModule { }
