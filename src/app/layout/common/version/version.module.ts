import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VersionComponent } from './version.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialExampleModule } from 'material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
@NgModule({
  declarations: [
    VersionComponent
  ],
  imports: [
    CKEditorModule,
    MaterialExampleModule,
    FormsModule,
    ReactiveFormsModule,
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
