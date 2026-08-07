import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CustomerService } from 'src/app/core/services/customer.service';
import { CustomerResponse, EDocumentType, DOCUMENT_TYPE_LABELS, UpdateCustomerRequest } from 'src/app/core/models';
import { CustomerFormDialogComponent, CustomerFormDialogData } from './customer-form-dialog/customer-form-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  dataSource = new MatTableDataSource<CustomerResponse>([]);
  loading = false;
  displayedColumns = ['documentType', 'documentNumber', 'name', 'lastname', 'age', 'address', 'actions'];
  documentTypeLabels = DOCUMENT_TYPE_LABELS;
  searchControl = new FormControl('');

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCustomers();

    this.dataSource.filterPredicate = (customer, filter) =>
      customer.documentNumber.toString().includes(filter.trim());

    this.searchControl.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((value) => {
        this.dataSource.filter = (value ?? '').trim();
      });
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getAll().subscribe({
      next: (customers) => {
        this.dataSource.data = customers;
        this.loading = false;
      },
      error: (err: Error) => {
        this.loading = false;
        this.snackBar.open(err.message, 'Cerrar', { duration: 5000 });
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CustomerFormDialogComponent, { width: '480px' });

    dialogRef.afterClosed().subscribe((request) => {
      if (!request) return;

      this.customerService.create(request).subscribe({
        next: () => {
          this.snackBar.open('Cliente creado correctamente', 'Cerrar', { duration: 3000 });
          this.loadCustomers();
        },
        error: (err: Error) => {
          this.snackBar.open(err.message, 'Cerrar', { duration: 5000 });
        }
      });
    });
  }

  openEditDialog(customer: CustomerResponse): void {
    const dialogRef = this.dialog.open<CustomerFormDialogComponent, CustomerFormDialogData, UpdateCustomerRequest>(
      CustomerFormDialogComponent,
      { width: '480px', data: { customer } }
    );

    dialogRef.afterClosed().subscribe((request) => {
      if (!request) return;

      this.customerService.update(customer.documentNumber, request).subscribe({
        next: () => {
          this.snackBar.open('Cliente actualizado correctamente', 'Cerrar', { duration: 3000 });
          this.loadCustomers();
        },
        error: (err: Error) => {
          this.snackBar.open(err.message, 'Cerrar', { duration: 5000 });
        }
      });
    });
  }

  deleteCustomer(customer: CustomerResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar cliente',
        message: `¿Seguro que desea eliminar a ${customer.name} ${customer.lastname}?`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.customerService.delete(customer.documentNumber).subscribe({
        next: () => {
          this.snackBar.open('Cliente eliminado', 'Cerrar', { duration: 3000 });
          this.loadCustomers();
        },
        error: (err: Error) => {
          this.snackBar.open(err.message, 'Cerrar', { duration: 6000 });
        }
      });
    });
  }

  getDocumentTypeLabel(type: EDocumentType): string {
    return this.documentTypeLabels[type];
  }
}
