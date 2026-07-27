import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiclesRoutingModule } from './vehicles-routing.module';
import { VehiclesComponent } from './vehicles.component';
import { VehicleFormDialogComponent } from './vehicle-form-dialog/vehicle-form-dialog.component';
import { SharedModuleModule } from 'src/app/shared/shared-module.module';

@NgModule({
  declarations: [
    VehiclesComponent,
    VehicleFormDialogComponent
  ],
  imports: [
    CommonModule,
    VehiclesRoutingModule,
    SharedModuleModule
  ]
})
export class VehiclesModule { }
