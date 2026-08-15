import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { RegisterVehicleRequest, UpdateVehicleRequest, VehicleResponse } from 'src/app/core/models';
import { VehicleFormDialogComponent, VehicleFormDialogData } from './vehicle-form-dialog/vehicle-form-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
  vehicles: VehicleResponse[] = [];
  filteredVehicles: VehicleResponse[] = [];
  loading = false;
  searchControl = new FormControl('');

  constructor(
    private vehicleService: VehicleService,
    private dialog: Dialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadVehicles();

    this.searchControl.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((value) => {
        this.applyFilter(value ?? '');
      });
  }

  loadVehicles(): void {
    this.loading = true;
    this.vehicleService.getAll().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.applyFilter(this.searchControl.value ?? '');
        this.loading = false;
      },
      error: (err: Error) => {
        this.loading = false;
        this.notificationService.error(err.message);
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open<RegisterVehicleRequest, unknown, VehicleFormDialogComponent>(VehicleFormDialogComponent, { width: '480px' });

    dialogRef.closed.subscribe((request) => {
      if (!request) return;

      this.vehicleService.create(request).subscribe({
        next: () => {
          this.notificationService.success('Vehiculo registrado correctamente');
          this.loadVehicles();
        },
        error: (err: Error) => {
          this.notificationService.error(err.message);
        }
      });
    });
  }

  deleteVehicle(vehicle: VehicleResponse): void {
    const dialogRef = this.dialog.open<boolean, unknown, ConfirmDialogComponent>(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar vehículo',
        message: `¿Seguro que desea eliminar el vehículo ${vehicle.identifier} (${vehicle.brand} ${vehicle.model})?`
      }
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;

      this.vehicleService.delete(vehicle.identifier).subscribe({
        next: () => {
          this.notificationService.success('Vehiculo eliminado');
          this.loadVehicles();
        },
        error: (err: Error) => {
          this.notificationService.error(err.message);
        }
      });
    });
  }

  openEditDialog(vehicle: VehicleResponse): void {
    const dialogRef = this.dialog.open<UpdateVehicleRequest, VehicleFormDialogData, VehicleFormDialogComponent>(
      VehicleFormDialogComponent,
      { width: '480px', data: { vehicle } }
    );

    dialogRef.closed.subscribe((request) => {
      if (!request) return;

      this.vehicleService.update(vehicle.identifier, request).subscribe({
        next: () => {
          this.notificationService.success('Vehiculo actualizado correctamente');
          this.loadVehicles();
        },
        error: (err: Error) => {
          this.notificationService.error(err.message);
        }
      });
    });
  }

  private applyFilter(term: string): void {
    const value = term.trim().toLowerCase();
    this.filteredVehicles = value
      ? this.vehicles.filter((v) => v.identifier.toLowerCase().includes(value))
      : this.vehicles;
  }
}
