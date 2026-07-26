import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstallmentsRoutingModule } from './installments-routing.module';
import { InstallmentsComponent } from './installments.component';


@NgModule({
  declarations: [
    InstallmentsComponent
  ],
  imports: [
    CommonModule,
    InstallmentsRoutingModule
  ]
})
export class InstallmentsModule { }
