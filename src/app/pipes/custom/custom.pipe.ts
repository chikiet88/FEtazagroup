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
@Pipe({name: 'Filter'})
export class FilterPipe implements PipeTransform {
  transform(items:any,type: any,operator,value): any {
    switch (operator) {
      case '#':
        return items.filter(v=>v[type] != value);
      default:
       return items.filter(v=>v[type] == value);
        break;
    }
     return items.filter(v=>v[type] == value);
  }
}
@Pipe({name: 'Unique'})
export class UniquePipe implements PipeTransform {
  transform(items1:any,items2: any,type: any): any {
    items2.length!=0
    {
    items2.forEach(v => {
      items1 = items1.filter(v1=>v1[type] !=v)
    });
   }
     return items1;
  }
}
