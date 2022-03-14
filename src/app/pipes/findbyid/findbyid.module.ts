import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindbyidPipe } from './findbyid.pipe';
@NgModule({
  declarations: [FindbyidPipe],
  imports: [
    CommonModule
  ],
  exports:[FindbyidPipe]
})
export class FindbyidModule { }
