import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CustomerService } from 'src/app/core/services/customer.service';
import { CustomerResponse, EDocumentType, DOCUMENT_TYPE_LABELS, UpdateCustomerRequest, CreateCustomerRequest } from 'src/app/core/models';
import { CustomerFormDialogComponent, CustomerFormDialogData } from './customer-form-dialog/customer-form-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { CustomerLoansDialogComponent } from './customer-loans-dialog/customer-loans-dialog.component';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  customers: CustomerResponse[] = [];
  filteredCustomers: CustomerResponse[] = [];
  loading = false;
  documentTypeLabels = DOCUMENT_TYPE_LABELS;
  searchControl = new FormControl('');

  constructor(
    private customerService: CustomerService,
    private dialog: Dialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();

    this.searchControl.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((value) => {
        this.applyFilter(value ?? '');
      });
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getAll().subscribe({
      next: (customers) => {
        this.customers = customers;
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
    const dialogRef = this.dialog.open<CreateCustomerRequest, unknown, CustomerFormDialogComponent>(CustomerFormDialogComponent, { width: '480px' });

    dialogRef.closed.subscribe((request) => {
      if (!request) return;

      this.customerService.create(request).subscribe({
        next: () => {
          this.notificationService.success('Cliente creado correctamente');
          this.loadCustomers();
        },
        error: (err: Error) => {
          this.notificationService.error(err.message);
        }
      });
    });
  }

  openEditDialog(customer: CustomerResponse): void {
    const dialogRef = this.dialog.open<UpdateCustomerRequest, CustomerFormDialogData, CustomerFormDialogComponent>(
      CustomerFormDialogComponent,
      { width: '480px', data: { customer } }
    );

    dialogRef.closed.subscribe((request) => {
      if (!request) return;

      this.customerService.update(customer.documentNumber, request).subscribe({
        next: () => {
          this.notificationService.success('Cliente actualizado correctamente');
          this.loadCustomers();
        },
        error: (err: Error) => {
          this.notificationService.error(err.message);
        }
      });
    });
  }

  deleteCustomer(customer: CustomerResponse): void {
    const dialogRef = this.dialog.open<boolean, unknown, ConfirmDialogComponent>(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar cliente',
        message: `¿Seguro que desea eliminar a ${customer.name} ${customer.lastname}?`
      }
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;

      this.customerService.delete(customer.documentNumber).subscribe({
        next: () => {
          this.notificationService.success('Cliente eliminado');
          this.loadCustomers();
        },
        error: (err: Error) => {
          this.notificationService.error(err.message);
        }
      });
    });
  }

  openLoansDialog(customer: CustomerResponse): void {
    this.dialog.open(CustomerLoansDialogComponent, {
      width: '640px',
      data: { customer }
    });
  }

  private applyFilter(term: string): void {
    const value = term.trim();
    this.filteredCustomers = value
      ? this.customers.filter((c) => c.documentNumber.toString().includes(value))
      : this.customers;
  }

  getDocumentTypeLabel(type: EDocumentType): string {
    return this.documentTypeLabels[type];
  }
}
