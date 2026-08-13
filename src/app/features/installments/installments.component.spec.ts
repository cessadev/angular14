import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { InstallmentsComponent } from './installments.component';
import { InstallmentService } from 'src/app/core/services/installment.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { OverdueInstallment } from 'src/app/core/models';

describe('InstallmentsComponent', () => {
  let installmentServiceSpy: jasmine.SpyObj<InstallmentService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const overdueItem: OverdueInstallment = {
    loanReference: 'LN-ABC1234567',
    number: 2,
    amount: 8333333.33,
    dateExpiration: '2026-01-15T00:00:00Z',
    customer: 'Carlos Ruiz',
    vehicle: 'MK-1299',
    daysOverdue: 15
  };

  beforeEach(() => {
    installmentServiceSpy = jasmine.createSpyObj<InstallmentService>('InstallmentService', ['getAllOverdue']);
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'error']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
  });

  function createComponent(): InstallmentsComponent {
    return new InstallmentsComponent(installmentServiceSpy, notificationServiceSpy, routerSpy);
  }

  // [ngOnInit loads overdue installments]
  it('ngOnInit_Always_LoadsOverdueInstallments', () => {
    installmentServiceSpy.getAllOverdue.and.returnValue(of([overdueItem]));

    const component = createComponent();
    component.ngOnInit();

    expect(component.dataSource.data).toEqual([overdueItem]);
    expect(component.loading).toBeFalse();
  });

  // [Load error]
  it('loadOverdue_ServiceFails_NotifiesErrorAndStopsLoading', () => {
    installmentServiceSpy.getAllOverdue.and.returnValue(throwError(() => new Error('Network error')));

    const component = createComponent();
    component.loadOverdue();

    expect(component.loading).toBeFalse();
    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith('Network error');
  });

  // [View loan]
  it('viewLoan_Always_NavigatesToInstallmentsLoanRoute', () => {
    const component = createComponent();
    component.viewLoan(overdueItem);

    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/installments', 'loan', overdueItem.loanReference]);
  });
});
