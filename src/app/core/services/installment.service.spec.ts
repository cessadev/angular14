import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { InstallmentService } from './installment.service';
import { InstallmentResponse, RegisterPaymentRequest, LoanSummary, OverdueInstallment, EPaymentMethod } from '../models';

describe('InstallmentService', () => {
  let service: InstallmentService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/installment`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InstallmentService]
    });

    service = TestBed.inject(InstallmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // [Get installments by loan]
  it('getByLoan_ValidReference_SendsGetRequestToLoanUrl', () => {
    const expectedInstallments: InstallmentResponse[] = [
      {
        loanReference: 'LN-ABC1234567',
        number: 1,
        paymentReference: 'LN-ABC1234567-01',
        amount: 8333333.33,
        amountPaid: 0,
        dateExpiration: '2026-02-15T00:00:00Z',
        datePayment: null,
        paid: false
      }
    ];

    service.getByLoan('LN-ABC1234567').subscribe((installments) => {
      expect(installments).toEqual(expectedInstallments);
    });

    const req = httpMock.expectOne(`${baseUrl}/loan/LN-ABC1234567`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedInstallments);
  });

  // [Get loan summary]
  it('getSummary_ValidReference_SendsGetRequestToSummaryUrl', () => {
    const expectedSummary: LoanSummary = {
      reference: 'LN-ABC1234567',
      customer: 'Carlos Ruiz',
      vehicle: 'MK-1299',
      totalInstallments: 12,
      installmentsPaid: 3,
      installmentsOwed: 9,
      totalValue: 100000000,
      totalPaid: 25000000,
      totalOwed: 75000000
    };

    service.getSummary('LN-ABC1234567').subscribe((summary) => {
      expect(summary).toEqual(expectedSummary);
    });

    const req = httpMock.expectOne(`${baseUrl}/loan/LN-ABC1234567/summary`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedSummary);
  });

  // [Get overdue installments of a specific loan]
  it('getOverdueByLoan_ValidReference_SendsGetRequestToLoanOverdueUrl', () => {
    const expectedOverdue: OverdueInstallment[] = [
      {
        loanReference: 'LN-ABC1234567',
        number: 2,
        amount: 8333333.33,
        dateExpiration: '2026-01-15T00:00:00Z',
        customer: 'Carlos Ruiz',
        vehicle: 'MK-1299',
        daysOverdue: 15
      }
    ];

    service.getOverdueByLoan('LN-ABC1234567').subscribe((overdue) => {
      expect(overdue).toEqual(expectedOverdue);
    });

    const req = httpMock.expectOne(`${baseUrl}/loan/LN-ABC1234567/overdue`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedOverdue);
  });

  // [Get all overdue installments]
  it('getAllOverdue_Always_SendsGetRequestToOverdueUrl', () => {
    const expectedOverdue: OverdueInstallment[] = [];

    service.getAllOverdue().subscribe((overdue) => {
      expect(overdue).toEqual(expectedOverdue);
    });

    const req = httpMock.expectOne(`${baseUrl}/overdue`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedOverdue);
  });

  // [Register a payment]
  it('registerPayment_ValidRequest_SendsPatchRequestToPayUrl', () => {
    const request: RegisterPaymentRequest = {
      method: EPaymentMethod.PSE,
      amount: 8333333.33
    };

    service.registerPayment('LN-ABC1234567-01', request).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/LN-ABC1234567-01/pay`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(request);
    req.flush({
      loanReference: 'LN-ABC1234567',
      number: 1,
      paymentReference: 'LN-ABC1234567-01',
      amount: 8333333.33,
      amountPaid: 8333333.33,
      dateExpiration: '2026-02-15T00:00:00Z',
      datePayment: '2026-01-20T00:00:00Z',
      paid: true
    });
  });
});
