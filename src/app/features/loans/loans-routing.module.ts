import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoansComponent } from './loans.component';
import { LoanDetailComponent } from './loan-detail/loan-detail.component';

const routes: Routes = [
  { path: '', component: LoansComponent },
  { path: ':reference', component: LoanDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoansRoutingModule { }
