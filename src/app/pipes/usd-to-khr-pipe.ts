import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usdToKhr',
})
export class UsdToKhrPipe implements PipeTransform {
  transform(value: number, rate: number = 4100, roundTo: number = 100): string {
    if (!value) return '0៛';

    // Convert USD → KHR
    let khr = value * rate;

    // Remove last two digits (round down to nearest 100)
    khr = Math.floor(khr / roundTo) * roundTo;

    // Format with commas
    const formatted = khr.toLocaleString('en-US');

    return `${formatted}៛`;
  }
}
