import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sum'
})
export class SumPipe implements PipeTransform {

    transform(total: any, items: any[]): any {
        if (!items.length) return total;
        let tempTotal = 0;
        items.forEach((el) => {
            if (!el) return;
            tempTotal += parseInt(el)
        });
        return tempTotal
    }
}
