import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { IconName } from './shared/components/icon/icon.component';

const SIDENAV_COLLAPSE_BREAKPOINT = '(max-width: 768px)';

interface NavLink {
  path: string;
  label: string;
  icon: IconName;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  isMobile$: Observable<boolean> = this.breakpointObserver
    .observe(SIDENAV_COLLAPSE_BREAKPOINT)
    .pipe(
      map((result) => result.matches),
      shareReplay(1)
    );

  private isMobile = false;
  private isMobileSubscription?: Subscription;

  sidenavOpen = false;

  navLinks: NavLink[] = [
    { path: '/dashboard', label: 'Panel general', icon: 'dashboard' },
    { path: '/customers', label: 'Clientes', icon: 'people' },
    { path: '/vehicles', label: 'Vehículos', icon: 'car' },
    { path: '/loans', label: 'Préstamos', icon: 'quote' },
    { path: '/installments', label: 'Mora', icon: 'payments' }
  ];

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.isMobileSubscription = this.isMobile$.subscribe((value) => (this.isMobile = value));
  }

  ngOnDestroy(): void {
    this.isMobileSubscription?.unsubscribe();
  }

  toggleSidenav(): void {
    this.sidenavOpen = !this.sidenavOpen;
  }

  closeIfMobile(): void {
    if (this.isMobile) {
      this.sidenavOpen = false;
    }
  }
}
