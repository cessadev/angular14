import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoansRoutingModule } from './loans-routing.module';
import { LoansComponent } from './loans.component';
import { LoanFormDialogComponent } from './loan-form-dialog/loan-form-dialog.component';
import { LoanDetailComponent } from './loan-detail/loan-detail.component';
import { SharedModuleModule } from 'src/app/shared/shared-module.module';
import { LoanSimulationDialogComponent } from './loan-simulation-dialog/loan-simulation-dialog.component';


@NgModule({
  declarations: [
    LoansComponent,
    LoanFormDialogComponent,
    LoanDetailComponent,
    LoanSimulationDialogComponent
  ],
  imports: [
    CommonModule,
    LoansRoutingModule,
    SharedModuleModule
  ]
})
export class LoansModule { }
