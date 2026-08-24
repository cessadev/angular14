import { of, Subject } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AppComponent } from './app.component';
import { ThemeService } from './core/services/theme.service';

function fakeBreakpointState(matches: boolean): BreakpointState {
  return { matches, breakpoints: {} };
}

describe('AppComponent', () => {
  let breakpointObserverSpy: jasmine.SpyObj<BreakpointObserver>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;

  beforeEach(() => {
    breakpointObserverSpy = jasmine.createSpyObj<BreakpointObserver>('BreakpointObserver', ['observe']);
    themeServiceSpy = jasmine.createSpyObj<ThemeService>('ThemeService', ['toggleTheme', 'setTheme']);
    themeServiceSpy.isLight$ = of(false);
  });

  // [Regression guard: must stay width-only, not orientation-coupled]
  it('constructor_Always_ObservesWidthOnlyBreakpointQuery', () => {
    breakpointObserverSpy.observe.and.returnValue(of(fakeBreakpointState(false)));

    new AppComponent(breakpointObserverSpy, themeServiceSpy);

    expect(breakpointObserverSpy.observe).toHaveBeenCalledOnceWith('(max-width: 768px)');
  });

  // [Breakpoint matches]
  it('isMobile$_BreakpointMatches_EmitsTrue', () => {
    breakpointObserverSpy.observe.and.returnValue(of(fakeBreakpointState(true)));
    const component = new AppComponent(breakpointObserverSpy, themeServiceSpy);

    let result: boolean | undefined;
    component.isMobile$.subscribe((isMobile) => (result = isMobile));

    expect(result).toBeTrue();
  });

  // [Breakpoint does not match]
  it('isMobile$_BreakpointDoesNotMatch_EmitsFalse', () => {
    breakpointObserverSpy.observe.and.returnValue(of(fakeBreakpointState(false)));
    const component = new AppComponent(breakpointObserverSpy, themeServiceSpy);

    let result: boolean | undefined;
    component.isMobile$.subscribe((isMobile) => (result = isMobile));

    expect(result).toBeFalse();
  });

  // [closeIfMobile, mobile]
  it('closeIfMobile_MobileAfterInit_ClosesSidenav', () => {
    breakpointObserverSpy.observe.and.returnValue(of(fakeBreakpointState(true)));
    const component = new AppComponent(breakpointObserverSpy, themeServiceSpy);
    component.ngOnInit();
    component.sidenavOpen = true;

    component.closeIfMobile();

    expect(component.sidenavOpen).toBeFalse();
  });

  // [closeIfMobile, desktop]
  it('closeIfMobile_DesktopAfterInit_DoesNotCloseSidenav', () => {
    breakpointObserverSpy.observe.and.returnValue(of(fakeBreakpointState(false)));
    const component = new AppComponent(breakpointObserverSpy, themeServiceSpy);
    component.ngOnInit();
    component.sidenavOpen = true;

    component.closeIfMobile();

    expect(component.sidenavOpen).toBeTrue();
  });

  // [closeIfMobile before ngOnInit ever ran]
  it('closeIfMobile_BeforeNgOnInit_DoesNotCloseSidenav', () => {
    breakpointObserverSpy.observe.and.returnValue(of(fakeBreakpointState(true)));
    const component = new AppComponent(breakpointObserverSpy, themeServiceSpy);
    component.sidenavOpen = true;

    component.closeIfMobile();

    expect(component.sidenavOpen).toBeTrue();
  });

  // [ngOnDestroy actually stops reacting to further breakpoint changes]
  it('ngOnDestroy_Always_UnsubscribesFromFurtherBreakpointChanges', () => {
    const breakpoint$ = new Subject<BreakpointState>();
    breakpointObserverSpy.observe.and.returnValue(breakpoint$.asObservable());

    const component = new AppComponent(breakpointObserverSpy, themeServiceSpy);
    component.ngOnInit();

    breakpoint$.next(fakeBreakpointState(true));
    component.ngOnDestroy();
    breakpoint$.next(fakeBreakpointState(false));

    component.sidenavOpen = true;
    component.closeIfMobile();

    expect(component.sidenavOpen).toBeFalse();
  });

  // [isLight$ exposes the service's observable as-is]
  it('isLight$_Always_ReflectsThemeServiceIsLight', () => {
    themeServiceSpy.isLight$ = of(true);
    breakpointObserverSpy.observe.and.returnValue(of(fakeBreakpointState(false)));
    const component = new AppComponent(breakpointObserverSpy, themeServiceSpy);

    let result: boolean | undefined;
    component.isLight$.subscribe((isLight) => (result = isLight));

    expect(result).toBeTrue();
  });

  // [toggleTheme delegates to ThemeService]
  it('toggleTheme_Always_DelegatesToThemeService', () => {
    breakpointObserverSpy.observe.and.returnValue(of(fakeBreakpointState(false)));
    const component = new AppComponent(breakpointObserverSpy, themeServiceSpy);

    component.toggleTheme();

    expect(themeServiceSpy.toggleTheme).toHaveBeenCalledTimes(1);
  });
});
