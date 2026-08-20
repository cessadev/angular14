import { Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appLiquidDialogClose]'
})
export class LiquidDialogCloseDirective {
  @Output() appLiquidDialogClose = new EventEmitter<void>();

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  @HostListener('click')
  onClick(): void {
    const pane = this.el.nativeElement.closest('.cdk-overlay-pane') as HTMLElement | null;

    if (!pane) {
      this.appLiquidDialogClose.emit();
      return;
    }

    const unlisten = this.renderer.listen(pane, 'animationend', () => {
      unlisten();
      this.appLiquidDialogClose.emit();
    });

    this.renderer.addClass(pane, 'liquid-dialog-closing');
  }
}
