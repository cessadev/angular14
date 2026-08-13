import { of, throwError, Subject } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DashboardSummary } from 'src/app/core/models';

describe('DashboardComponent', () => {
  let dashboardServiceSpy: jasmine.SpyObj<DashboardService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const summary: DashboardSummary = {
    totalLoans: 10,
    activeLoans: 7,
    paidLoans: 3,
    totalPortfolioValue: 350000000,
    totalCollected: 120000000,
    totalOverdueAmount: 8500000,
    overdueInstallmentsCount: 4,
    totalCustomers: 9,
    totalVehicles: 10,
    delinquencyRate: 2.4286
  };

  beforeEach(() => {
    dashboardServiceSpy = jasmine.createSpyObj<DashboardService>('DashboardService', ['getSummary']);
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'error']);
  });

  function createComponent(): DashboardComponent {
    return new DashboardComponent(dashboardServiceSpy, notificationServiceSpy);
  }

  // [ngOnInit delegates to loadSummary]
  it('ngOnInit_Always_LoadsSummary', () => {
    dashboardServiceSpy.getSummary.and.returnValue(of(summary));

    const component = createComponent();
    component.ngOnInit();

    expect(dashboardServiceSpy.getSummary).toHaveBeenCalledTimes(1);
    expect(component.summary).toEqual(summary);
  });

  // [Loading flag while the request is pending]
  it('loadSummary_WhilePending_SetsLoadingTrueBeforeResolution', () => {
    const summary$ = new Subject<DashboardSummary>();
    dashboardServiceSpy.getSummary.and.returnValue(summary$.asObservable());

    const component = createComponent();
    component.loadSummary();

    expect(component.loading).toBeTrue();

    summary$.next(summary);

    expect(component.loading).toBeFalse();
    expect(component.summary).toEqual(summary);
  });

  // [Error]
  it('loadSummary_ServiceFails_NotifiesErrorAndStopsLoading', () => {
    dashboardServiceSpy.getSummary.and.returnValue(throwError(() => new Error('Network error')));

    const component = createComponent();
    component.loadSummary();

    expect(component.loading).toBeFalse();
    expect(component.summary).toBeUndefined();
    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith('Network error');
  });
});
