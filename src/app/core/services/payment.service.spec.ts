import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { PaymentService } from './payment.service';
import { PaymentResponse, EPaymentMethod } from '../models';

describe('PaymentService', () => {
  let service: PaymentService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/payment`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentService]
    });

    service = TestBed.inject(PaymentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // [Get payments by loan]
  it('getByLoan_ValidReference_SendsGetRequestToLoanUrl', () => {
    const expectedPayments: PaymentResponse[] = [
      {
        number: 'PAY-12345678',
        amount: 8333333.33,
        method: EPaymentMethod.PSE,
        referencePayment: 'LN-ABC1234567-01',
        date: '2026-01-20T00:00:00Z',
        installmentNumber: 1,
        loanReference: 'LN-ABC1234567'
      }
    ];

    service.getByLoan('LN-ABC1234567').subscribe((payments) => {
      expect(payments).toEqual(expectedPayments);
    });

    const req = httpMock.expectOne(`${baseUrl}/loan/LN-ABC1234567`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedPayments);
  });

  // [Get payments by installment]
  it('getByInstallment_ValidPaymentReference_SendsGetRequestToInstallmentUrl', () => {
    const expectedPayments: PaymentResponse[] = [
      {
        number: 'PAY-12345678',
        amount: 8333333.33,
        method: EPaymentMethod.PSE,
        referencePayment: 'LN-ABC1234567-01',
        date: '2026-01-20T00:00:00Z',
        installmentNumber: 1,
        loanReference: 'LN-ABC1234567'
      }
    ];

    service.getByInstallment('LN-ABC1234567-01').subscribe((payments) => {
      expect(payments).toEqual(expectedPayments);
    });

    const req = httpMock.expectOne(`${baseUrl}/installment/LN-ABC1234567-01`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedPayments);
  });
});
