import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = this.extractMessage(error);
        return throwError(() => new Error(message));
      })
    );
  }

  private extractMessage(error: HttpErrorResponse): string {
  if (typeof error.error === 'string' && error.error.trim().length > 0) {
    return error.error;
  }
  if (error.error?.message) {
    return error.error.message;
  }
  if (error.status === 0) {
    return 'Unable to connect to the server. Please verify that the API is running.';
  }
  if (error.status === 404) {
    return 'The requested resource does not exist.';
  }
  return error.error?.title ?? `An unexpected error occurred (code ${error.status}).`;
}
}
