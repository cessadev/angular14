import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { DashboardService } from './dashboard.service';
import { DashboardSummary } from '../models';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/dashboard`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService]
    });

    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // [Get portfolio summary]
  it('getSummary_Always_SendsGetRequestToSummaryUrl', () => {
    const expectedSummary: DashboardSummary = {
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

    service.getSummary().subscribe((summary) => {
      expect(summary).toEqual(expectedSummary);
    });

    const req = httpMock.expectOne(`${baseUrl}/summary`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedSummary);
  });
});
