import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'input[appNumericFormat]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumericFormatDirective),
      multi: true
    }
  ]
})
export class NumericFormatDirective implements ControlValueAccessor {
  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  writeValue(value: number | null): void {
    this.el.nativeElement.value = this.format(value);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  @HostListener('input', ['$event.target.value'])
  onInput(rawValue: string): void {
    const cleaned = this.sanitize(rawValue);
    const numericValue = this.parse(cleaned);

    this.el.nativeElement.value = this.formatRaw(cleaned);
    this.onChange(numericValue);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  private sanitize(rawValue: string): string {
    const digitsAndComma = rawValue.replace(/[^\d,]/g, '');
    const firstComma = digitsAndComma.indexOf(',');

    if (firstComma === -1) {
      return digitsAndComma;
    }

    const integerPart = digitsAndComma.slice(0, firstComma).replace(/,/g, '');
    const decimalPart = digitsAndComma.slice(firstComma + 1).replace(/,/g, '').slice(0, 2);

    return `${integerPart},${decimalPart}`;
  }

  private parse(cleaned: string): number | null {
    if (!cleaned || cleaned === ',') {
      return null;
    }

    const parsed = Number(cleaned.replace(',', '.'));

    return Number.isNaN(parsed) ? null : parsed;
  }

  private formatRaw(cleaned: string): string {
    if (!cleaned) {
      return '';
    }

    const [integerPart, decimalPart] = cleaned.split(',');
    const formattedInteger = new Intl.NumberFormat('es-CO').format(Number(integerPart || '0'));

    return decimalPart !== undefined ? `${formattedInteger},${decimalPart}` : formattedInteger;
  }

  private format(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }

    const hasDecimals = !Number.isInteger(value);

    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: 2
    }).format(value);
  }
}
