import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstallmentsRoutingModule } from './installments-routing.module';
import { InstallmentsComponent } from './installments.component';
import { LoanInstallmentsComponent } from './loan-installments/loan-installments.component';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { SharedModuleModule } from 'src/app/shared/shared-module.module';


@NgModule({
  declarations: [
    InstallmentsComponent,
    LoanInstallmentsComponent,
    PaymentDialogComponent
  ],
  imports: [
    CommonModule,
    InstallmentsRoutingModule,
    SharedModuleModule
  ]
})
export class InstallmentsModule { }
