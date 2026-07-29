import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({ name: 'copCurrency' })
export class CopCurrencyPipe implements PipeTransform {
  private currencyPipe = new CurrencyPipe('es-CO');

  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '';
    return this.currencyPipe.transform(value, 'COP', 'symbol-narrow', '1.0-0') ?? '';
  }
}
