import { ElementRef } from '@angular/core';
import { NumericFormatDirective } from './numeric-format.directive';

describe('NumericFormatDirective', () => {
  let inputEl: HTMLInputElement;
  let elementRefMock: ElementRef<HTMLInputElement>;
  let directive: NumericFormatDirective;

  beforeEach(() => {
    inputEl = document.createElement('input');
    elementRefMock = { nativeElement: inputEl } as ElementRef<HTMLInputElement>;
    directive = new NumericFormatDirective(elementRefMock);
  });

  it('writeValue_NullValue_SetsEmptyString', () => {
    directive.writeValue(null);

    expect(inputEl.value).toBe('');
  });

  it('writeValue_UndefinedValue_SetsEmptyString', () => {
    directive.writeValue(undefined as unknown as null);

    expect(inputEl.value).toBe('');
  });

  it('writeValue_Zero_SetsFormattedZeroNotEmptyString', () => {
    directive.writeValue(0);

    expect(inputEl.value).toBe('0');
  });

  it('writeValue_LargeNumber_SetsValueWithThousandsSeparators', () => {
    directive.writeValue(4000000);

    expect(inputEl.value).toBe('4.000.000');
  });

  it('writeValue_DecimalValue_SetsValueWithCommaSeparatorAndTwoDecimals', () => {
    directive.writeValue(77777.77);

    expect(inputEl.value).toBe('77.777,77');
  });

  it('onInput_DigitsOnly_CallsOnChangeWithParsedNumber', () => {
    const onChangeSpy = jasmine.createSpy('onChange');
    directive.registerOnChange(onChangeSpy);

    directive.onInput('4000000');

    expect(onChangeSpy).toHaveBeenCalledOnceWith(4000000);
  });

  it('onInput_ValueWithNonDigitCharacters_StripsThemBeforeParsing', () => {
    const onChangeSpy = jasmine.createSpy('onChange');
    directive.registerOnChange(onChangeSpy);

    directive.onInput('4.000.000');

    expect(onChangeSpy).toHaveBeenCalledOnceWith(4000000);
  });

  it('onInput_EmptyValue_CallsOnChangeWithNull', () => {
    const onChangeSpy = jasmine.createSpy('onChange');
    directive.registerOnChange(onChangeSpy);

    directive.onInput('');

    expect(onChangeSpy).toHaveBeenCalledOnceWith(null);
  });

  it('onInput_OnlyNonDigitCharacters_CallsOnChangeWithNull', () => {
    const onChangeSpy = jasmine.createSpy('onChange');
    directive.registerOnChange(onChangeSpy);

    directive.onInput('...');

    expect(onChangeSpy).toHaveBeenCalledOnceWith(null);
  });

  // [Decimal input]
  it('onInput_ValueWithDecimalComma_CallsOnChangeWithDecimalNumber', () => {
    const onChangeSpy = jasmine.createSpy('onChange');
    directive.registerOnChange(onChangeSpy);

    directive.onInput('77777,77');

    expect(onChangeSpy).toHaveBeenCalledOnceWith(77777.77);
  });

  it('onInput_FormattedValueWithThousandsDotsAndDecimalComma_ParsesCorrectly', () => {
    const onChangeSpy = jasmine.createSpy('onChange');
    directive.registerOnChange(onChangeSpy);

    directive.onInput('77.777,77');

    expect(onChangeSpy).toHaveBeenCalledOnceWith(77777.77);
  });

  it('onInput_MoreThanTwoDecimalDigits_TruncatesToTwoDecimals', () => {
    const onChangeSpy = jasmine.createSpy('onChange');
    directive.registerOnChange(onChangeSpy);

    directive.onInput('77777,7789');

    expect(onChangeSpy).toHaveBeenCalledOnceWith(77777.77);
  });

  it('onInput_TrailingComma_CallsOnChangeWithIntegerAndKeepsCommaDisplayed', () => {
    const onChangeSpy = jasmine.createSpy('onChange');
    directive.registerOnChange(onChangeSpy);

    directive.onInput('4000,');

    expect(onChangeSpy).toHaveBeenCalledOnceWith(4000);
    expect(inputEl.value).toBe('4.000,');
  });

  it('onInput_OnlyComma_CallsOnChangeWithNull', () => {
    const onChangeSpy = jasmine.createSpy('onChange');
    directive.registerOnChange(onChangeSpy);

    directive.onInput(',');

    expect(onChangeSpy).toHaveBeenCalledOnceWith(null);
  });

  it('onInput_DecimalValue_UpdatesDisplayedValueWithThousandsAndDecimalSeparators', () => {
    directive.registerOnChange(() => {});

    directive.onInput('77777,77');

    expect(inputEl.value).toBe('77.777,77');
  });

  it('onInput_Always_UpdatesDisplayedValueWithThousandsSeparators', () => {
    directive.registerOnChange(() => {});

    directive.onInput('4000000');

    expect(inputEl.value).toBe('4.000.000');
  });

  it('onInput_BeforeOnChangeRegistered_DoesNotThrow', () => {
    expect(() => directive.onInput('4000000')).not.toThrow();
  });

  it('onBlur_Always_CallsOnTouched', () => {
    const onTouchedSpy = jasmine.createSpy('onTouched');
    directive.registerOnTouched(onTouchedSpy);

    directive.onBlur();

    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('onBlur_BeforeOnTouchedRegistered_DoesNotThrow', () => {
    expect(() => directive.onBlur()).not.toThrow();
  });

  it('setDisabledState_True_DisablesNativeInput', () => {
    directive.setDisabledState(true);

    expect(inputEl.disabled).toBeTrue();
  });

  it('setDisabledState_False_EnablesNativeInput', () => {
    inputEl.disabled = true;

    directive.setDisabledState(false);

    expect(inputEl.disabled).toBeFalse();
  });
});
