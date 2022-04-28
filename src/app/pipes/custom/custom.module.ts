import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomPipe, DemSoPipe, FilterPipe} from './custom.pipe';
@NgModule({
  declarations: [CustomPipe,DemSoPipe,FilterPipe],
  imports: [
    CommonModule
  ],
  exports:[CustomPipe,DemSoPipe,FilterPipe]
})
export class CustomModule { }
