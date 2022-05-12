import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomPipe, DemSoPipe, FilterPipe, FindnestedPipe, UniquePipe} from './custom.pipe';
@NgModule({
  declarations: [CustomPipe,DemSoPipe,FilterPipe,UniquePipe,FindnestedPipe],
  imports: [
    CommonModule
  ],
  exports:[CustomPipe,DemSoPipe,FilterPipe,UniquePipe,FindnestedPipe]
})
export class CustomModule { }
