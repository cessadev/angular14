import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { CopCurrencyPipe } from './cop-currency.pipe';

registerLocaleData(localeEsCo, 'es-CO');

describe('CopCurrencyPipe', () => {
  let pipe: CopCurrencyPipe;

  beforeEach(() => {
    pipe = new CopCurrencyPipe();
  });

  // [Null value]
  it('transform_NullValue_ReturnsEmptyString', () => {
    expect(pipe.transform(null)).toBe('');
  });

  // [Undefined value]
  it('transform_UndefinedValue_ReturnsEmptyString', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  // [Positive whole amount]
  it('transform_PositiveWholeAmount_FormatsAsColombianPesosWithoutDecimals', () => {
    const result = pipe.transform(1234567);
    expect(result).toMatch(/^\$\s?1\.234\.567$/);
  });

  // [Zero]
  it('transform_Zero_ReturnsFormattedZero', () => {
    const result = pipe.transform(0);
    expect(result).toMatch(/^\$\s?0$/);
  });

  // [Uses the narrow symbol, not the ISO code]
  it('transform_AnyAmount_UsesNarrowPesoSymbolNotIsoCode', () => {
    const result = pipe.transform(50000);
    expect(result).toContain('$');
    expect(result).not.toContain('COP');
  });

  // [Decimal input shows up to two decimals, without forcing trailing zeros]
  it('transform_DecimalAmountWithOneSignificantDigit_ShowsThatDigitWithoutTrailingZero', () => {
    const result = pipe.transform(999.6);
    expect(result).toMatch(/^\$\s?999,6$/);
  });

  // [Cents from installment amortization must remain visible]
  it('transform_AmountWithCents_ShowsBothDecimalDigits', () => {
    const result = pipe.transform(77777.77);
    expect(result).toMatch(/^\$\s?77\.777,77$/);
  });

  // [Whole amount never shows a trailing decimal separator]
  it('transform_WholeAmount_DoesNotShowDecimalSeparator', () => {
    const result = pipe.transform(5000000);
    expect(result).not.toContain(',');
  });
});
