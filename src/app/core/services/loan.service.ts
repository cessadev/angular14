import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoanResponse, CreateLoanRequest, SimulateLoanRequest, LoanSimulation } from '../models';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private readonly baseUrl = `${environment.apiUrl}/loan`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<LoanResponse[]> {
    return this.http.get<LoanResponse[]>(this.baseUrl);
  }

  getByReference(reference: string): Observable<LoanResponse> {
    return this.http.get<LoanResponse>(`${this.baseUrl}/${reference}`);
  }

  create(request: CreateLoanRequest): Observable<LoanResponse> {
    return this.http.post<LoanResponse>(this.baseUrl, request);
  }

  delete(reference: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${reference}`);
  }

  simulate(request: SimulateLoanRequest): Observable<LoanSimulation> {
    return this.http.post<LoanSimulation>(`${this.baseUrl}/simulate`, request);
  }
}
