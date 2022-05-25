import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomPipe, DemSoPipe, FilterPipe, FindbyidPipe, FindnestedPipe, TracnghiemPipe, UniquePipe} from './custom.pipe';
@NgModule({
  declarations: [CustomPipe,DemSoPipe,FilterPipe,UniquePipe,FindnestedPipe , TracnghiemPipe, FindbyidPipe],
  imports: [
    CommonModule
  ],
  exports:[CustomPipe,DemSoPipe,FilterPipe,UniquePipe,FindnestedPipe,TracnghiemPipe, FindbyidPipe]
})
export class CustomModule { }
