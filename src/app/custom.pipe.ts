import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'Custom'})
export class CustomPipe implements PipeTransform {
  transform(id:any,items: any): any {
    return items[id];
  }
}
