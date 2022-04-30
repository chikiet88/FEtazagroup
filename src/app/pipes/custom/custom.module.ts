import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomPipe, DemSoPipe, FilterPipe, UniquePipe} from './custom.pipe';
@NgModule({
  declarations: [CustomPipe,DemSoPipe,FilterPipe,UniquePipe],
  imports: [
    CommonModule
  ],
  exports:[CustomPipe,DemSoPipe,FilterPipe,UniquePipe]
})
export class CustomModule { }
