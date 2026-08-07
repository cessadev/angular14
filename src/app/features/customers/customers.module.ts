import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { CustomerFormDialogComponent } from './customer-form-dialog/customer-form-dialog.component';
import { SharedModuleModule } from 'src/app/shared/shared-module.module';
import { CustomerLoansDialogComponent } from './customer-loans-dialog/customer-loans-dialog.component';

@NgModule({
  declarations: [
    CustomersComponent,
    CustomerFormDialogComponent,
    CustomerLoansDialogComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModuleModule
  ]
})
export class CustomersModule { }
