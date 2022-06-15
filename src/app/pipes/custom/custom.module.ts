import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomPipe, DemSoPipe, FilterPipe, FindnestedPipe, SafePipe, UniquePipe} from './custom.pipe';
@NgModule({
  declarations: [CustomPipe,DemSoPipe,FilterPipe,UniquePipe,FindnestedPipe,SafePipe],
  imports: [
    CommonModule
  ],
  exports:[CustomPipe,DemSoPipe,FilterPipe,UniquePipe,FindnestedPipe,SafePipe]
})
export class CustomModule { }
