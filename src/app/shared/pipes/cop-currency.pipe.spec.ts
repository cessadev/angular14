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

  // [Positive amount]
  it('transform_PositiveAmount_FormatsAsColombianPesosWithoutDecimals', () => {
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

  // [Decimal input is rounded, no decimals should ever be visible]
  it('transform_DecimalAmount_RoundsToWholeNumberWithNoVisibleDecimals', () => {
    const result = pipe.transform(999.6);
    expect(result).toMatch(/^\$\s?\d{1,3}(\.\d{3})*$/);
  });
});
