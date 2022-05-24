import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'findbyid' })
export class FindbyidPipe implements PipeTransform {
    transform(id: any, items: any, result: any): any {
        let data = items.find((v) => v.id == id);
        if (data) {
            return items.find((v) => v.id == id)[result];
        }
    }
}
@Pipe({ name: 'tracnghiemPipe' })
export class TracnghiemPipe implements PipeTransform {
    transform(items: any): any {
        console.log(items);

        switch (Number(items)) {
            case 1:
                return 'A';
                break;
            case 2: {
                return 'B';
                break;
            }
            case 3: {
                return 'C';
                break;
            }
            case 4: {
                return 'D';
                break;
            }
            case 5: {
                return 'E';
                break;
            }
            case 6: {
                return 'F';
                break;
            }
            default: {
                // do something
            }
        }
    }
}
