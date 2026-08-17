import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') text = '';

  private tooltipEl: HTMLElement | null = null;

  constructor(private host: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  @HostListener('focus')
  show(): void {
    if (!this.text || this.tooltipEl) return;

    const tooltip = this.renderer.createElement('span') as HTMLElement;
    this.renderer.addClass(tooltip, 'app-tooltip');
    this.renderer.appendChild(tooltip, this.renderer.createText(this.text));
    this.renderer.appendChild(document.body, tooltip);

    const hostRect = this.host.nativeElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const top = hostRect.top - tooltipRect.height - 8;
    const left = hostRect.left + hostRect.width / 2 - tooltipRect.width / 2;

    this.renderer.setStyle(tooltip, 'top', `${Math.max(top, 4)}px`);
    this.renderer.setStyle(tooltip, 'left', `${Math.max(left, 4)}px`);

    requestAnimationFrame(() => this.renderer.addClass(tooltip, 'app-tooltip--visible'));

    this.tooltipEl = tooltip;
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  hide(): void {
    if (this.tooltipEl) {
      this.renderer.removeChild(document.body, this.tooltipEl);
      this.tooltipEl = null;
    }
  }

  ngOnDestroy(): void {
    this.hide();
  }
}
