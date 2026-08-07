import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { LoanPaymentsComponent } from './loan-payments/loan-payments.component';
import { SharedModuleModule } from 'src/app/shared/shared-module.module';

@NgModule({
  declarations: [LoanPaymentsComponent],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    SharedModuleModule
  ]
})
export class PaymentsModule { }
