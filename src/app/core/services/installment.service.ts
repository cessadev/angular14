import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  InstallmentResponse, RegisterPaymentRequest, LoanSummary, OverdueInstallment
} from '../models';

@Injectable({ providedIn: 'root' })
export class InstallmentService {
  private readonly baseUrl = `${environment.apiUrl}/installment`;

  constructor(private http: HttpClient) {}

  getByLoan(loanReference: string): Observable<InstallmentResponse[]> {
    return this.http.get<InstallmentResponse[]>(`${this.baseUrl}/loan/${loanReference}`);
  }

  getSummary(loanReference: string): Observable<LoanSummary> {
    return this.http.get<LoanSummary>(`${this.baseUrl}/loan/${loanReference}/summary`);
  }

  getOverdueByLoan(loanReference: string): Observable<OverdueInstallment[]> {
    return this.http.get<OverdueInstallment[]>(`${this.baseUrl}/loan/${loanReference}/overdue`);
  }

  getAllOverdue(): Observable<OverdueInstallment[]> {
    return this.http.get<OverdueInstallment[]>(`${this.baseUrl}/overdue`);
  }

  registerPayment(paymentReference: string, request: RegisterPaymentRequest): Observable<InstallmentResponse> {
    return this.http.patch<InstallmentResponse>(`${this.baseUrl}/${paymentReference}/pay`, request);
  }
}
