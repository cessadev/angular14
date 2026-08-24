import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const THEME_STORAGE_KEY = 'carcredit-theme';
const LIGHT_CLASS = 'theme-light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isLightSubject = new BehaviorSubject<boolean>(
    document.documentElement.classList.contains(LIGHT_CLASS)
  );

  isLight$ = this.isLightSubject.asObservable();

  toggleTheme(): void {
    this.setTheme(!this.isLightSubject.value);
  }

  setTheme(isLight: boolean): void {
    document.documentElement.classList.toggle(LIGHT_CLASS, isLight);
    localStorage.setItem(THEME_STORAGE_KEY, isLight ? 'light' : 'dark');
    this.isLightSubject.next(isLight);
  }
}
