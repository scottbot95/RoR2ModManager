import { Pipe, PipeTransform } from '@angular/core';
import { titleize, underscore } from 'inflection';

@Pipe({
  name: 'humanize'
})
export class HumanizePipe implements PipeTransform {
  transform(value: string, enable = true): string {
    if (enable) return titleize(underscore(value));
    else return value;
  }
}
