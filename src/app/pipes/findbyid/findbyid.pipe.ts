import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'findbyid'})
export class FindbyidPipe implements PipeTransform {
  transform(id:any,items: any,result:any): any {  
    return items.find(v=>v.id == id)[result];
  }
}
@Pipe({name: 'findbyuuid'})
export class FindbyuuidPipe implements PipeTransform {
  transform(uuid:any,items: any,result:any): any {  
    return items.find(v=>v.uuid == uuid)[result];
  }
}
@Pipe({name: 'findbytype'})
export class FindbytypePipe implements PipeTransform {
  transform(value:any,items: any,type:any): any {  
    return items.find(v=>v[type] == value);
  }
}
