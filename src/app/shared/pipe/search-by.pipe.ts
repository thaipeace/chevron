import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'searchBy'
})
export class SearchByPipe implements PipeTransform {

    transform(items: any[], keyword: string, searchField: string): any {
        return items.filter(item => {
            return item[searchField] ? item[searchField].toString().toLowerCase().includes(keyword.toLowerCase()) : '';
        });
    }

}
