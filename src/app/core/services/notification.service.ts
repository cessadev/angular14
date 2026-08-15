import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { FeedbackDialogComponent, FeedbackDialogData } from 'src/app/shared/components/feedback-dialog/feedback-dialog.component';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private dialog: Dialog) {}

  success(message: string, title = 'Operación exitosa'): void {
    this.open({ type: 'success', title, message });
  }

  error(message: string, title = 'No se pudo completar la operación'): void {
    this.open({ type: 'error', title, message });
  }

  private open(data: FeedbackDialogData): void {
    this.dialog.open(FeedbackDialogComponent, { width: '360px', data });
  }
}
