import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VehicleResponse, RegisterVehicleRequest, UpdateVehicleRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly baseUrl = `${environment.apiUrl}/vehicle`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<VehicleResponse[]> {
    return this.http.get<VehicleResponse[]>(this.baseUrl);
  }

  getByIdentifier(identifier: string): Observable<VehicleResponse> {
    return this.http.get<VehicleResponse>(`${this.baseUrl}/${identifier}`);
  }

  create(request: RegisterVehicleRequest): Observable<VehicleResponse> {
    return this.http.post<VehicleResponse>(this.baseUrl, request);
  }

  update(identifier: string, request: UpdateVehicleRequest): Observable<VehicleResponse> {
    return this.http.put<VehicleResponse>(`${this.baseUrl}/${identifier}`, request);
  }
}
