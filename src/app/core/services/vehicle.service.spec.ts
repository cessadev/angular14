import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { VehicleService } from './vehicle.service';
import { VehicleResponse, RegisterVehicleRequest, UpdateVehicleRequest, EVehicleBrand } from '../models';

describe('VehicleService', () => {
  let service: VehicleService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/vehicle`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VehicleService]
    });

    service = TestBed.inject(VehicleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // [Get all vehicles]
  it('getAll_Always_SendsGetRequestToBaseUrl', () => {
    const expectedVehicles: VehicleResponse[] = [
      {
        identifier: 'MK-1299',
        brand: EVehicleBrand.Toyota,
        model: 'Hilux Cargo',
        marketValue: 125000000,
        year: 2025
      }
    ];

    service.getAll().subscribe((vehicles) => {
      expect(vehicles).toEqual(expectedVehicles);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(expectedVehicles);
  });

  // [Get by identifier]
  it('getByIdentifier_ValidIdentifier_SendsGetRequestToCorrectUrl', () => {
    const expectedVehicle: VehicleResponse = {
      identifier: 'MK-1299',
      brand: EVehicleBrand.Toyota,
      model: 'Hilux Cargo',
      marketValue: 125000000,
      year: 2025
    };

    service.getByIdentifier('MK-1299').subscribe((vehicle) => {
      expect(vehicle).toEqual(expectedVehicle);
    });

    const req = httpMock.expectOne(`${baseUrl}/MK-1299`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedVehicle);
  });

  // [Create vehicle]
  it('create_ValidRequest_SendsPostRequestWithBody', () => {
    const request: RegisterVehicleRequest = {
      identifier: 'MK-1299',
      brand: EVehicleBrand.Toyota,
      model: 'Hilux Cargo',
      marketValue: 125000000,
      year: 2025
    };

    service.create(request).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({ ...request });
  });

  // [Update vehicle]
  it('update_ValidRequest_SendsPutRequestToIdentifierUrl', () => {
    const request: UpdateVehicleRequest = {
      brand: EVehicleBrand.Toyota,
      model: 'Hilux Cargo 4x4',
      marketValue: 130000000,
      year: 2025
    };

    service.update('MK-1299', request).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/MK-1299`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush({ identifier: 'MK-1299', ...request });
  });

  // [Delete vehicle]
  it('delete_ValidIdentifier_SendsDeleteRequestToIdentifierUrl', () => {
    service.delete('MK-1299').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/MK-1299`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
