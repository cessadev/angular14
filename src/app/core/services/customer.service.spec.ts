import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { CustomerService } from './customer.service';
import { CustomerResponse, CreateCustomerRequest, UpdateCustomerRequest, EDocumentType } from '../models';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/customer`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CustomerService]
    });

    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // [Get all customers]
  it('getAll_Always_SendsGetRequestToBaseUrl', () => {
    const expectedCustomers: CustomerResponse[] = [
      {
        documentType: EDocumentType.CedulaCiudadania,
        documentNumber: 123456789,
        name: 'Carlos',
        lastname: 'Ruiz',
        age: 35,
        address: 'Calle 50 #23-10, Barranquilla'
      }
    ];

    service.getAll().subscribe((customers) => {
      expect(customers).toEqual(expectedCustomers);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(expectedCustomers);
  });

  // [Get by document number]
  it('getByDocumentNumber_ValidDocumentNumber_SendsGetRequestToCorrectUrl', () => {
    const expectedCustomer: CustomerResponse = {
      documentType: EDocumentType.CedulaCiudadania,
      documentNumber: 123456789,
      name: 'Carlos',
      lastname: 'Ruiz',
      age: 35,
      address: 'Calle 50 #23-10, Barranquilla'
    };

    service.getByDocumentNumber(123456789).subscribe((customer) => {
      expect(customer).toEqual(expectedCustomer);
    });

    const req = httpMock.expectOne(`${baseUrl}/123456789`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedCustomer);
  });

  // [Create customer]
  it('create_ValidRequest_SendsPostRequestWithBody', () => {
    const request: CreateCustomerRequest = {
      documentType: EDocumentType.CedulaCiudadania,
      documentNumber: 123456789,
      name: 'Carlos',
      lastname: 'Ruiz',
      age: 35,
      address: 'Calle 50 #23-10, Barranquilla'
    };

    service.create(request).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({ ...request });
  });

  // [Update customer]
  it('update_ValidRequest_SendsPutRequestToDocumentNumberUrl', () => {
    const request: UpdateCustomerRequest = {
      name: 'Carlos',
      lastname: 'Ruiz Gómez',
      age: 36,
      address: 'Calle 72 #10-45, Barranquilla'
    };

    service.update(123456789, request).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/123456789`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush({
      documentType: EDocumentType.CedulaCiudadania,
      documentNumber: 123456789,
      ...request
    });
  });

  // [Delete customer]
  it('delete_ValidDocumentNumber_SendsDeleteRequestToDocumentNumberUrl', () => {
    service.delete(123456789).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/123456789`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
