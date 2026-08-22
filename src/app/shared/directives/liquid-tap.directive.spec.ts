import { ElementRef, Renderer2 } from '@angular/core';
import { LiquidTapDirective } from './liquid-tap.directive';

describe('LiquidTapDirective', () => {
  let hostEl: HTMLElement;
  let elementRefMock: ElementRef<HTMLElement>;
  let rendererSpy: jasmine.SpyObj<Renderer2>;
  let directive: LiquidTapDirective;

  beforeEach(() => {
    hostEl = document.createElement('button');
    elementRefMock = { nativeElement: hostEl } as ElementRef<HTMLElement>;
    rendererSpy = jasmine.createSpyObj<Renderer2>('Renderer2', ['addClass', 'removeClass']);
    rendererSpy.addClass.and.callFake((el: HTMLElement, cls: string) => el.classList.add(cls));
    rendererSpy.removeClass.and.callFake((el: HTMLElement, cls: string) => el.classList.remove(cls));

    directive = new LiquidTapDirective(elementRefMock, rendererSpy);
  });

  it('onClick_Always_AddsLiquidTapClass', () => {
    directive.onClick();

    expect(hostEl.classList.contains('liquid-tap')).toBeTrue();
  });

  it('onClick_ClassAlreadyPresentFromAPreviousTap_RemovesThenReAddsItToRestartTheAnimation', () => {
    hostEl.classList.add('liquid-tap');

    directive.onClick();

    expect(rendererSpy.removeClass).toHaveBeenCalledBefore(rendererSpy.addClass);
    expect(hostEl.classList.contains('liquid-tap')).toBeTrue();
  });

  it('onAnimationEnd_Always_RemovesLiquidTapClass', () => {
    hostEl.classList.add('liquid-tap');

    directive.onAnimationEnd();

    expect(hostEl.classList.contains('liquid-tap')).toBeFalse();
  });
});
