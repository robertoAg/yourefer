import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'parseValidationPipe'})
export class ParseValidationPipe implements PipeTransform {
  transform(value: string): string {
    return 'Must start by ' + value
    .replace('^https?:\\/\\/', 'https://')
    .replace(/\\/g, '')
    .replace('|^$', '');
  }
}
