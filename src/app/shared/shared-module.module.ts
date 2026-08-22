import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { FeedbackDialogComponent } from './components/feedback-dialog/feedback-dialog.component';
import { CopCurrencyPipe } from './pipes/cop-currency.pipe';
import { DialogModule } from '@angular/cdk/dialog';
import { IconComponent } from './components/icon/icon.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { NumericFormatDirective } from './directives/numeric-format.directive';
import { LiquidTapDirective } from './directives/liquid-tap.directive';
import { LiquidDialogCloseDirective } from './directives/liquid-dialog-close.directive';

const MATERIAL_MODULES = [
  DialogModule
];

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    FeedbackDialogComponent,
    IconComponent,
    SpinnerComponent,
    TooltipDirective,
    NumericFormatDirective,
    LiquidTapDirective,
    LiquidDialogCloseDirective,
    CopCurrencyPipe
  ],
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    ...MATERIAL_MODULES,
    ConfirmDialogComponent,
    FeedbackDialogComponent,
    IconComponent,
    SpinnerComponent,
    TooltipDirective,
    NumericFormatDirective,
    LiquidTapDirective,
    LiquidDialogCloseDirective,
    CopCurrencyPipe
  ]
})
export class SharedModuleModule { }
