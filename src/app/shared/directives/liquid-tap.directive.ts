import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

const TAPPED_CLASS = 'liquid-tap';

@Directive({
  selector: '[appLiquidTap]'
})
export class LiquidTapDirective {
  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  @HostListener('click')
  onClick(): void {
    this.renderer.removeClass(this.el.nativeElement, TAPPED_CLASS);
    void this.el.nativeElement.offsetWidth;
    this.renderer.addClass(this.el.nativeElement, TAPPED_CLASS);
  }

  @HostListener('animationend')
  onAnimationEnd(): void {
    this.renderer.removeClass(this.el.nativeElement, TAPPED_CLASS);
  }
}
