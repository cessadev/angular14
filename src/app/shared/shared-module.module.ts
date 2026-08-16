import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { FeedbackDialogComponent } from './components/feedback-dialog/feedback-dialog.component';
import { CopCurrencyPipe } from './pipes/cop-currency.pipe';
import { DialogModule } from '@angular/cdk/dialog';
import { IconComponent } from './components/icon/icon.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

const MATERIAL_MODULES = [
  MatFormFieldModule, MatInputModule, MatSelectModule,
  DialogModule, MatCardModule, MatTooltipModule
];

@NgModule({
  declarations: [ConfirmDialogComponent, FeedbackDialogComponent, IconComponent, SpinnerComponent, CopCurrencyPipe],
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  exports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES, ConfirmDialogComponent, FeedbackDialogComponent, IconComponent, SpinnerComponent, CopCurrencyPipe]
})
export class SharedModuleModule { }
