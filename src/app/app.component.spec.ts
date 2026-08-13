import { of, Subject } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
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
    const sidenavSpy = jasmine.createSpyObj<MatSidenav>('MatSidenav', ['close']);

    const component = new AppComponent(breakpointObserverSpy);
    component.ngOnInit();
    component.closeIfMobile(sidenavSpy);

    expect(sidenavSpy.close).toHaveBeenCalledTimes(1);
  });

  // [closeIfMobile, desktop]
  it('closeIfMobile_DesktopAfterInit_DoesNotCloseSidenav', () => {
    breakpointObserverSpy.observe.and.returnValue(of(fakeBreakpointState(false)));
    const sidenavSpy = jasmine.createSpyObj<MatSidenav>('MatSidenav', ['close']);

    const component = new AppComponent(breakpointObserverSpy);
    component.ngOnInit();
    component.closeIfMobile(sidenavSpy);

    expect(sidenavSpy.close).not.toHaveBeenCalled();
  });

  // [closeIfMobile before ngOnInit ever ran]
  it('closeIfMobile_BeforeNgOnInit_DoesNotCloseSidenav', () => {
    breakpointObserverSpy.observe.and.returnValue(of(fakeBreakpointState(true)));
    const sidenavSpy = jasmine.createSpyObj<MatSidenav>('MatSidenav', ['close']);

    const component = new AppComponent(breakpointObserverSpy);
    // ngOnInit() deliberately not called

    component.closeIfMobile(sidenavSpy);

    expect(sidenavSpy.close).not.toHaveBeenCalled();
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

    const sidenavSpy = jasmine.createSpyObj<MatSidenav>('MatSidenav', ['close']);
    component.closeIfMobile(sidenavSpy);

    // If the unsubscribe worked, the internal flag stayed frozen at "true"
    // (its value right before destroy), so the sidenav still closes here —
    // proving the post-destroy "false" emission was never applied.
    expect(sidenavSpy.close).toHaveBeenCalledTimes(1);
  });
});
