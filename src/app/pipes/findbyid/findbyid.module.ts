import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindbyidPipe, FindbytypePipe, FindbyuuidPipe } from './findbyid.pipe';
@NgModule({
  declarations: [FindbyidPipe,FindbyuuidPipe,FindbytypePipe],
  imports: [
    CommonModule
  ],
  exports:[FindbyidPipe,FindbyuuidPipe,FindbytypePipe]
})
export class FindbyidModule { }
