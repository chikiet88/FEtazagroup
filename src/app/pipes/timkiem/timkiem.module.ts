import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimkiemPipe } from './timkiem.pipe';
@NgModule({
  declarations: [TimkiemPipe],
  imports: [
    CommonModule
  ],
  exports:[TimkiemPipe]
})
export class TimkiemModule { }
