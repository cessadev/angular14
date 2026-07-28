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
    if (error.error?.detail) {
      return error.error.detail;
    }
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que la API esté corriendo.';
    }
    if (error.status === 404) {
      return 'El recurso solicitado no existe.';
    }
    return error.error?.title ?? `Ocurrió un error inesperado (código ${error.status}).`;
  }
}
