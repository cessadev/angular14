import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  constructor(@Inject(MAT_DIALOG_DATA) public data: FeedbackDialogData) {}
}
