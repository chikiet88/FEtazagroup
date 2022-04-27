import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'Custom'})
export class CustomPipe implements PipeTransform {
  transform(id:any,items: any): any {
    return items[id];
  }
}
@Pipe({name: 'DemSo'})
export class DemSoPipe implements PipeTransform {
  transform(value:any,items:any,type: any,status:any,value1:any): any {
     let data = items.filter(v=>v[type] == value);
     return data.filter(v=>v[status] == value1);
  }
}
