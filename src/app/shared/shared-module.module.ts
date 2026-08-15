import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { FeedbackDialogComponent } from './components/feedback-dialog/feedback-dialog.component';
import { CopCurrencyPipe } from './pipes/cop-currency.pipe';
import { DialogModule } from '@angular/cdk/dialog';

const MATERIAL_MODULES = [
  MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule,
  MatInputModule, MatSelectModule, DialogModule, MatProgressSpinnerModule,
  MatToolbarModule, MatSidenavModule, MatListModule,
  MatCardModule, MatTooltipModule, MatChipsModule
];

@NgModule({
  declarations: [ConfirmDialogComponent, FeedbackDialogComponent, CopCurrencyPipe],
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  exports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES, ConfirmDialogComponent, FeedbackDialogComponent, CopCurrencyPipe]
})
export class SharedModuleModule { }
