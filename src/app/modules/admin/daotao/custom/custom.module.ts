import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindbyidPipe, TracnghiemPipe } from './custom.pipe';


@NgModule({
  declarations: [FindbyidPipe, TracnghiemPipe],
  imports: [
    CommonModule,
    
  ],exports:[FindbyidPipe, TracnghiemPipe]
})
export class CustomModule { }
