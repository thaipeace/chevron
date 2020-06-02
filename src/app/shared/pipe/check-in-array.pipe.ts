import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'checkInArray'
})
export class CheckInArrayPipe implements PipeTransform {

    transform(item: any, items: any[]): any {
        if (!item) return false;
        if (!items.length) return false;
        if(items.indexOf(item) > -1) return true;
        return false;
    }
}
