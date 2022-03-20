import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindbyidPipe, FindbyuuidPipe } from './findbyid.pipe';
@NgModule({
  declarations: [FindbyidPipe,FindbyuuidPipe],
  imports: [
    CommonModule
  ],
  exports:[FindbyidPipe,FindbyuuidPipe]
})
export class FindbyidModule { }
