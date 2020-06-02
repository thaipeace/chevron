import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'varianceChecking'
})
export class VarianceCheckingPipe implements PipeTransform {

  transform(value: any, limit: number): any {
    if (!value) return false;
    if (Math.abs(value) >= limit) return true;
    return false;
  }
}
