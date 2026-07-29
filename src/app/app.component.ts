import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  isMobile$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(1)
    );

  private isMobile = false;
  private isMobileSubscription?: Subscription;

  navLinks = [
    { path: '/customers', label: 'Clientes', icon: 'people' },
    { path: '/vehicles', label: 'Vehículos', icon: 'directions_car' },
    { path: '/loans', label: 'Préstamos', icon: 'request_quote' },
    { path: '/installments', label: 'Cuotas', icon: 'payments' }
  ];

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.isMobileSubscription = this.isMobile$.subscribe((value) => (this.isMobile = value));
  }

  ngOnDestroy(): void {
    this.isMobileSubscription?.unsubscribe();
  }

  closeIfMobile(sidenav: MatSidenav): void {
    if (this.isMobile) {
      sidenav.close();
    }
  }
}
