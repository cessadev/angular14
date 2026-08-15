import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';

export type FeedbackType = 'success' | 'error';

export interface FeedbackDialogData {
  type: FeedbackType;
  title: string;
  message: string;
}

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.scss']
})
export class FeedbackDialogComponent {
  constructor(@Inject(DIALOG_DATA) public data: FeedbackDialogData) {}
}
