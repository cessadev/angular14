import { ElementRef, Renderer2 } from '@angular/core';
import { LiquidDialogCloseDirective } from './liquid-dialog-close.directive';

describe('LiquidDialogCloseDirective', () => {
  let paneEl: HTMLElement;
  let buttonEl: HTMLElement;
  let rendererSpy: jasmine.SpyObj<Renderer2>;
  let directive: LiquidDialogCloseDirective;

  beforeEach(() => {
    paneEl = document.createElement('div');
    paneEl.classList.add('cdk-overlay-pane');

    buttonEl = document.createElement('button');
    paneEl.appendChild(buttonEl);

    rendererSpy = jasmine.createSpyObj<Renderer2>('Renderer2', ['addClass', 'listen']);
    rendererSpy.addClass.and.callFake((el: HTMLElement, cls: string) => el.classList.add(cls));

    directive = new LiquidDialogCloseDirective({ nativeElement: buttonEl } as ElementRef<HTMLElement>, rendererSpy);
  });

  it('onClick_PaneFound_AddsClosingClassToPane', () => {
    rendererSpy.listen.and.returnValue(() => {});

    directive.onClick();

    expect(paneEl.classList.contains('liquid-dialog-closing')).toBeTrue();
  });

  it('onClick_PaneFound_EmitsOnlyAfterAnimationEndFires', () => {
    let animationEndCallback: (event?: unknown) => void = () => {};
    rendererSpy.listen.and.callFake((_target: unknown, _event: string, cb: (event: unknown) => void) => {
      animationEndCallback = cb;
      return () => {};
    });
    const emitSpy = spyOn(directive.appLiquidDialogClose, 'emit');

    directive.onClick();
    expect(emitSpy).not.toHaveBeenCalled();

    animationEndCallback();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('onClick_PaneNotFound_EmitsImmediatelyAsASafetyNet', () => {
    const orphanButton = document.createElement('button'); // fuera de .cdk-overlay-pane
    directive = new LiquidDialogCloseDirective({ nativeElement: orphanButton } as ElementRef<HTMLElement>, rendererSpy);
    const emitSpy = spyOn(directive.appLiquidDialogClose, 'emit');

    directive.onClick();

    expect(emitSpy).toHaveBeenCalled();
    expect(rendererSpy.listen).not.toHaveBeenCalled();
  });
});
