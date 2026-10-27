import { Directive, ElementRef, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Displays Colombian pesos while Angular forms keep a number (or null). */
@Directive({
  selector: 'input[appCopInput]',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CopInputDirective), multi: true }]
})
export class CopInputDirective implements ControlValueAccessor {
  private change: (value: number | null) => void = () => {};
  private touched: () => void = () => {};
  private readonly format = new Intl.NumberFormat('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  constructor(private element: ElementRef<HTMLInputElement>) {}
  writeValue(value: number | null): void {
    this.element.nativeElement.value = value == null || !Number.isFinite(value) ? '' : '$ ' + this.format.format(value);
  }
  registerOnChange(fn: (value: number | null) => void): void { this.change = fn; }
  registerOnTouched(fn: () => void): void { this.touched = fn; }
  setDisabledState(disabled: boolean): void { this.element.nativeElement.disabled = disabled; }
  @HostListener('input') input(): void {
    const input = this.element.nativeElement;
    const raw = input.value;
    const caret = input.selectionStart ?? raw.length;
    const logicalPosition = raw.slice(0, caret).replace(/[^\d,-]/g, '').length;
    const clean = raw.replace(/[^\d,-]/g, '');
    if (!/\d/.test(clean)) {
      input.value = clean.startsWith('-') ? '-': '';
      this.change(null);
      return;
    }
    const negative = clean.startsWith('-');
    const parts = clean.replace(/-/g, '').split(',');
    const integer = parts[0].replace(/^0+(?=\d)/, '') || '0';
    const decimals = parts.length > 1 ? ',' + parts.slice(1).join('').slice(0, 2) : '';
    const number = Number((negative ? '-' : '') + integer + decimals.replace(',', '.'));
    input.value = '$ ' + (negative ? '-' : '') + integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + decimals;
    this.change(Number.isFinite(number) ? number : null);
    let position = 2, count = 0;
    for (; position < input.value.length && count < logicalPosition; position++) {
      if (/[\d,-]/.test(input.value[position])) count++;
    }
    input.setSelectionRange(position, position);
  }
  @HostListener('blur') blur(): void {
    const raw = this.element.nativeElement.value.replace(/[^\d,-]/g, '');
    this.writeValue(/\d/.test(raw) ? Number(raw.replace(',', '.')) : null);
    this.touched();
  }
}
