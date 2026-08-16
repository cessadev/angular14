import { of, Subject } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AppComponent } from './app.component';

function fakeBreakpointState(matches: boolean): BreakpointState {
  return { matches, breakpoints: {} };
}

describe('AppComponent', () => {
  let breakpointObserverSpy: jasmine.SpyObj<BreakpointObserver>;

  beforeEach(() => {
    breakpointObserverSpy = jasmine.createSpyObj<BreakpointObserver>('BreakpointObserver', ['observe']);
  });

  // [Regression guard: must stay width-only, not orientation-coupled]
  it('constructor_Always_ObservesWidthOnlyBreakpointQuery', () => {
    breakpointObserverSpy.observe.and.returnValue(of(fakeBreakpointState(false)));

    new AppComponent(breakpointObserverSpy);

    expect(breakpointObserverSpy.observe).toHaveBeenCalledOnceWith('(max-width: 768px)');
  });

  // [Breakpoint matches]
  it('isMobile$_BreakpointMatches_EmitsTrue', () => {
    breakpointObserverSpy.observe.and.returnValue(of(fakeBreakpointState(true)));
    const component = new AppComponent(breakpointObserverSpy);

    let result: boolean | undefined;
    component.isMobile$.subscribe((isMobile) => (result = isMobile));

    expect(result).toBeTrue();
  });

  // [Breakpoint does not match]
  it('isMobile$_BreakpointDoesNotMatch_EmitsFalse', () => {
    breakpointObserverSpy.observe.and.returnValue(of(fakeBreakpointState(false)));
    const component = new AppComponent(breakpointObserverSpy);

    let result: boolean | undefined;
    component.isMobile$.subscribe((isMobile) => (result = isMobile));

    expect(result).toBeFalse();
  });

  // [closeIfMobile, mobile]
  it('closeIfMobile_MobileAfterInit_ClosesSidenav', () => {
    breakpointObserverSpy.observe.and.returnValue(of(fakeBreakpointState(true)));
    const component = new AppComponent(breakpointObserverSpy);
    component.ngOnInit();
    component.sidenavOpen = true;

    component.closeIfMobile();

    expect(component.sidenavOpen).toBeFalse();
  });

  // [closeIfMobile, desktop]
  it('closeIfMobile_DesktopAfterInit_DoesNotCloseSidenav', () => {
    breakpointObserverSpy.observe.and.returnValue(of(fakeBreakpointState(false)));
    const component = new AppComponent(breakpointObserverSpy);
    component.ngOnInit();
    component.sidenavOpen = true;

    component.closeIfMobile();

    expect(component.sidenavOpen).toBeTrue();
  });

  // [closeIfMobile before ngOnInit ever ran]
  it('closeIfMobile_BeforeNgOnInit_DoesNotCloseSidenav', () => {
    breakpointObserverSpy.observe.and.returnValue(of(fakeBreakpointState(true)));
    const component = new AppComponent(breakpointObserverSpy);
    component.sidenavOpen = true;
    // ngOnInit() is deliberately not called

    component.closeIfMobile();

    expect(component.sidenavOpen).toBeTrue();
  });

  // [ngOnDestroy actually stops reacting to further breakpoint changes]
  it('ngOnDestroy_Always_UnsubscribesFromFurtherBreakpointChanges', () => {
    const breakpoint$ = new Subject<BreakpointState>();
    breakpointObserverSpy.observe.and.returnValue(breakpoint$.asObservable());

    const component = new AppComponent(breakpointObserverSpy);
    component.ngOnInit();

    breakpoint$.next(fakeBreakpointState(true));
    component.ngOnDestroy();
    breakpoint$.next(fakeBreakpointState(false));

    component.sidenavOpen = true;
    component.closeIfMobile();

    // If the unsubscribe worked, the internal flag remained set to “true”
    // (its value just before the destroy), so the side nav continues to close —
    // which proves that the post-destroy “false” emission was never applied.
    expect(component.sidenavOpen).toBeFalse();
  });
});
