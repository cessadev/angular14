import { ElementRef, Renderer2 } from '@angular/core';
import { TooltipDirective } from './tooltip.directive';

function fakeRenderer(): jasmine.SpyObj<Renderer2> {
  const renderer = jasmine.createSpyObj<Renderer2>('Renderer2', [
    'createElement', 'createText', 'addClass', 'appendChild', 'removeChild', 'setStyle'
  ]);
  renderer.createElement.and.callFake((name: string) => document.createElement(name));
  renderer.createText.and.callFake((text: string) => document.createTextNode(text));
  return renderer;
}

function fakeHostElementRef(rect: Partial<DOMRect>): ElementRef<HTMLElement> {
  const host = document.createElement('button');
  spyOn(host, 'getBoundingClientRect').and.returnValue(rect as DOMRect);
  return { nativeElement: host } as ElementRef<HTMLElement>;
}

describe('TooltipDirective', () => {
  let rendererSpy: jasmine.SpyObj<Renderer2>;
  let hostElementRef: ElementRef<HTMLElement>;

  beforeEach(() => {
    rendererSpy = fakeRenderer();
    hostElementRef = fakeHostElementRef({ top: 100, left: 50, width: 40, height: 40 });
  });

  it('show_TextProvided_AppendsTooltipSpanToBody', () => {
    const directive = new TooltipDirective(hostElementRef, rendererSpy);
    directive.text = 'Editar';

    directive.show();

    expect(rendererSpy.appendChild).toHaveBeenCalledWith(document.body, jasmine.any(HTMLElement));
    expect(rendererSpy.appendChild).toHaveBeenCalledTimes(2);
  });

  it('show_TextProvided_SetsTooltipTextContent', () => {
    const directive = new TooltipDirective(hostElementRef, rendererSpy);
    directive.text = 'Editar';

    directive.show();

    expect(rendererSpy.createText).toHaveBeenCalledOnceWith('Editar');
  });

  it('show_TextProvided_AddsBaseTooltipClass', () => {
    const directive = new TooltipDirective(hostElementRef, rendererSpy);
    directive.text = 'Editar';

    directive.show();

    expect(rendererSpy.addClass).toHaveBeenCalledWith(jasmine.any(HTMLElement), 'app-tooltip');
  });

  it('show_HostRectKnown_PositionsTooltipAboveAndCenteredOnHost', () => {
    // El span del tooltip nunca se inserta de verdad en el DOM (appendChild es un spy),
    // así que su getBoundingClientRect() siempre da 0 — cálculo 100% determinista:
    // top = hostRect.top - 0 - 8 = 92 | left = hostRect.left + hostRect.width/2 - 0/2 = 70
    const directive = new TooltipDirective(hostElementRef, rendererSpy);
    directive.text = 'Editar';

    directive.show();

    expect(rendererSpy.setStyle).toHaveBeenCalledWith(jasmine.any(HTMLElement), 'top', '92px');
    expect(rendererSpy.setStyle).toHaveBeenCalledWith(jasmine.any(HTMLElement), 'left', '70px');
  });

  it('show_ComputedPositionBelowMinimum_ClampsToFourPixels', () => {
    hostElementRef = fakeHostElementRef({ top: 5, left: 0, width: 10, height: 10 });
    const directive = new TooltipDirective(hostElementRef, rendererSpy);
    directive.text = 'Editar';

    directive.show();

    // top = 5 - 0 - 8 = -3 -> se limita a 4 | left = 0 + 10/2 - 0/2 = 5 -> no se limita
    expect(rendererSpy.setStyle).toHaveBeenCalledWith(jasmine.any(HTMLElement), 'top', '4px');
    expect(rendererSpy.setStyle).toHaveBeenCalledWith(jasmine.any(HTMLElement), 'left', '5px');
  });

  it('show_Always_AddsVisibleClassOnNextAnimationFrame', () => {
    spyOn(window, 'requestAnimationFrame').and.callFake((callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
    const directive = new TooltipDirective(hostElementRef, rendererSpy);
    directive.text = 'Editar';

    directive.show();

    expect(rendererSpy.addClass).toHaveBeenCalledWith(jasmine.any(HTMLElement), 'app-tooltip--visible');
  });

  it('show_EmptyText_DoesNotCreateTooltip', () => {
    const directive = new TooltipDirective(hostElementRef, rendererSpy);
    directive.text = '';

    directive.show();

    expect(rendererSpy.appendChild).not.toHaveBeenCalled();
  });

  it('show_TooltipAlreadyVisible_DoesNotCreateASecondTooltip', () => {
    const directive = new TooltipDirective(hostElementRef, rendererSpy);
    directive.text = 'Editar';

    directive.show();
    directive.show();

    expect(rendererSpy.appendChild).toHaveBeenCalledTimes(2);
  });

  it('hide_TooltipVisible_RemovesTooltipFromBody', () => {
    const directive = new TooltipDirective(hostElementRef, rendererSpy);
    directive.text = 'Editar';
    directive.show();

    directive.hide();

    expect(rendererSpy.removeChild).toHaveBeenCalledOnceWith(document.body, jasmine.any(HTMLElement));
  });

  it('hide_NoTooltipVisible_DoesNothing', () => {
    const directive = new TooltipDirective(hostElementRef, rendererSpy);

    directive.hide();

    expect(rendererSpy.removeChild).not.toHaveBeenCalled();
  });

  it('hide_TooltipVisible_AllowsShowToCreateANewTooltipAfterwards', () => {
    const directive = new TooltipDirective(hostElementRef, rendererSpy);
    directive.text = 'Editar';
    directive.show();
    directive.hide();

    directive.show();

    expect(rendererSpy.appendChild).toHaveBeenCalledTimes(4);
  });

  it('ngOnDestroy_TooltipVisible_RemovesTooltipFromBody', () => {
    const directive = new TooltipDirective(hostElementRef, rendererSpy);
    directive.text = 'Editar';
    directive.show();

    directive.ngOnDestroy();

    expect(rendererSpy.removeChild).toHaveBeenCalledOnceWith(document.body, jasmine.any(HTMLElement));
  });
});
