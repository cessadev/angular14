import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstallmentsComponent } from './installments.component';
import { LoanInstallmentsComponent } from './loan-installments/loan-installments.component';

const routes: Routes = [
  { path: '', component: InstallmentsComponent },
  { path: 'loan/:reference', component: LoanInstallmentsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstallmentsRoutingModule { }
