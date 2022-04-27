import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomPipe, DemSoPipe} from './custom.pipe';
@NgModule({
  declarations: [CustomPipe,DemSoPipe],
  imports: [
    CommonModule
  ],
  exports:[CustomPipe,DemSoPipe]
})
export class CustomModule { }
