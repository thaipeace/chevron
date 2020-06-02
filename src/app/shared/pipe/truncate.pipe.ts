import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "truncate"
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, lenght: number): any {
    return value.length > lenght ? `${value.substring(0, lenght)}...` : value;
  }
}
