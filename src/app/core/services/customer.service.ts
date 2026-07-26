import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerResponse, CreateCustomerRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly baseUrl = `${environment.apiUrl}/customer`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<CustomerResponse[]> {
    return this.http.get<CustomerResponse[]>(this.baseUrl);
  }

  getByDocumentNumber(documentNumber: number): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.baseUrl}/${documentNumber}`);
  }

  create(request: CreateCustomerRequest): Observable<CustomerResponse> {
    return this.http.post<CustomerResponse>(this.baseUrl, request);
  }

  delete(documentNumber: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${documentNumber}`);
  }
}
