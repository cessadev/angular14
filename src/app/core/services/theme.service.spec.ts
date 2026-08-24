import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    document.documentElement.classList.remove('theme-light');
    localStorage.removeItem('carcredit-theme');
    service = new ThemeService();
  });

  afterEach(() => {
    document.documentElement.classList.remove('theme-light');
    localStorage.removeItem('carcredit-theme');
  });

  // [Initial state reads from the DOM class already applied pre-bootstrap]
  it('constructor_LightClassAlreadyOnDocumentElement_EmitsIsLightTrue', () => {
    document.documentElement.classList.add('theme-light');

    const lightService = new ThemeService();
    let emitted: boolean | undefined;
    lightService.isLight$.subscribe((value) => (emitted = value));

    expect(emitted).toBeTrue();

    document.documentElement.classList.remove('theme-light');
  });

  // [Toggle from dark to light]
  it('toggleTheme_CurrentlyDark_SwitchesToLightAndPersists', () => {
    service.toggleTheme();

    expect(document.documentElement.classList.contains('theme-light')).toBeTrue();
    expect(localStorage.getItem('carcredit-theme')).toBe('light');
  });

  // [Toggle twice returns to dark]
  it('toggleTheme_CalledTwice_ReturnsToDark', () => {
    service.toggleTheme();
    service.toggleTheme();

    expect(document.documentElement.classList.contains('theme-light')).toBeFalse();
    expect(localStorage.getItem('carcredit-theme')).toBe('dark');
  });

  // [setTheme emits through isLight$]
  it('setTheme_SetToLight_EmitsIsLightTrue', () => {
    let emitted: boolean | undefined;
    service.isLight$.subscribe((value) => (emitted = value));

    service.setTheme(true);

    expect(emitted).toBeTrue();
  });
});
