import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { LoanService } from './loan.service';
import {
  LoanResponse, CreateLoanRequest, SimulateLoanRequest, LoanSimulation,
  EInstallmentsTerm, EDocumentType
} from '../models';

describe('LoanService', () => {
  let service: LoanService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/loan`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoanService]
    });

    service = TestBed.inject(LoanService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // [Get all loans]
  it('getAll_Always_SendsGetRequestToBaseUrl', () => {
    const expectedLoans: LoanResponse[] = [
      {
        reference: 'LN-ABC1234567',
        customerDocumentNumber: 123456789,
        vehicleIdentifier: 'MK-1299',
        amount: 100000000,
        installments: EInstallmentsTerm.Months12,
        dateCreation: '2026-01-15T00:00:00Z'
      }
    ];

    service.getAll().subscribe((loans) => {
      expect(loans).toEqual(expectedLoans);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(expectedLoans);
  });

  // [Get by reference]
  it('getByReference_ValidReference_SendsGetRequestToCorrectUrl', () => {
    const expectedLoan: LoanResponse = {
      reference: 'LN-ABC1234567',
      customerDocumentNumber: 123456789,
      vehicleIdentifier: 'MK-1299',
      amount: 100000000,
      installments: EInstallmentsTerm.Months12,
      dateCreation: '2026-01-15T00:00:00Z'
    };

    service.getByReference('LN-ABC1234567').subscribe((loan) => {
      expect(loan).toEqual(expectedLoan);
    });

    const req = httpMock.expectOne(`${baseUrl}/LN-ABC1234567`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedLoan);
  });

  // [Get by customer, with query params]
  it('getByCustomer_ValidParams_SendsGetRequestWithDocumentTypeAndNumberAsQueryParams', () => {
    const expectedLoans: LoanResponse[] = [
      {
        reference: 'LN-ABC1234567',
        customerDocumentNumber: 123456789,
        vehicleIdentifier: 'MK-1299',
        amount: 100000000,
        installments: EInstallmentsTerm.Months12,
        dateCreation: '2026-01-15T00:00:00Z'
      }
    ];

    service.getByCustomer(EDocumentType.CedulaCiudadania, 123456789).subscribe((loans) => {
      expect(loans).toEqual(expectedLoans);
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === `${baseUrl}/customer` &&
        request.params.get('documentType') === 'CC' &&
        request.params.get('documentNumber') === '123456789'
    );
    expect(req.request.method).toBe('GET');
    req.flush(expectedLoans);
  });

  // [Create loan]
  it('create_ValidRequest_SendsPostRequestWithBody', () => {
    const request: CreateLoanRequest = {
      customerDocumentNumber: 123456789,
      vehicleIdentifier: 'MK-1299',
      amount: 100000000,
      installments: EInstallmentsTerm.Months12
    };

    service.create(request).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({
      reference: 'LN-ABC1234567',
      dateCreation: '2026-01-15T00:00:00Z',
      ...request
    });
  });

  // [Simulate loan]
  it('simulate_ValidRequest_SendsPostRequestToSimulateUrl', () => {
    const request: SimulateLoanRequest = {
      amount: 100000000,
      installments: EInstallmentsTerm.Months12,
      vehicleIdentifier: 'MK-1299'
    };

    const expectedSimulation: LoanSimulation = {
      amount: 100000000,
      installments: EInstallmentsTerm.Months12,
      installmentValue: 8333333.33,
      totalToPay: 100000000,
      schedule: []
    };

    service.simulate(request).subscribe((simulation) => {
      expect(simulation).toEqual(expectedSimulation);
    });

    const req = httpMock.expectOne(`${baseUrl}/simulate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(expectedSimulation);
  });

  // [Delete loan]
  it('delete_ValidReference_SendsDeleteRequestToReferenceUrl', () => {
    service.delete('LN-ABC1234567').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/LN-ABC1234567`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
