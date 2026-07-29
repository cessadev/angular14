import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
  { path: 'customers', loadChildren: () => import('./features/customers/customers.module').then(m => m.CustomersModule) },
  { path: 'vehicles', loadChildren: () => import('./features/vehicles/vehicles.module').then(m => m.VehiclesModule) },
  { path: 'loans', loadChildren: () => import('./features/loans/loans.module').then(m => m.LoansModule) },
  { path: 'installments', loadChildren: () => import('./features/installments/installments.module').then(m => m.InstallmentsModule) },
  { path: '**', redirectTo: 'customers' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
