import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tuychinh'
})
export class TuychinhPipe implements PipeTransform {

  transform(items: any, id:any): any {

    return items.filter(item => {item.id == id});
  }
  
  }
