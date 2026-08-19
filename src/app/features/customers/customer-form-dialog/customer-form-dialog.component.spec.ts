import { FormBuilder } from '@angular/forms';
import { CustomerFormDialogComponent, CustomerFormDialogData } from './customer-form-dialog.component';
import { CustomerResponse, EDocumentType, CreateCustomerRequest, UpdateCustomerRequest } from 'src/app/core/models';
import { DialogRef } from '@angular/cdk/dialog';
import { NotificationService } from 'src/app/core/services/notification.service';

describe('CustomerFormDialogComponent', () => {
  let dialogRefSpy: jasmine.SpyObj<DialogRef<CreateCustomerRequest | UpdateCustomerRequest, CustomerFormDialogComponent>>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const existingCustomer: CustomerResponse = {
    documentType: EDocumentType.CedulaCiudadania,
    documentNumber: 123456789,
    name: 'Carlos',
    lastname: 'Ruiz',
    age: 35,
    address: 'Calle 50 #23-10, Barranquilla'
  };

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj<DialogRef<CreateCustomerRequest | UpdateCustomerRequest, CustomerFormDialogComponent>>('DialogRef', ['close']);
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'error']);
  });

  function createComponent(data: CustomerFormDialogData | null): CustomerFormDialogComponent {
    return new CustomerFormDialogComponent(new FormBuilder(), dialogRefSpy, notificationServiceSpy, data);
  }

  // [Create mode]
  it('constructor_NoData_InitializesEmptyFormWithEditableDocumentFields', () => {
    const component = createComponent(null);

    expect(component.isEditMode).toBeFalse();
    expect(component.form.get('documentType')?.disabled).toBeFalse();
    expect(component.form.get('documentNumber')?.disabled).toBeFalse();
    expect(component.form.get('name')?.value).toBe('');
  });

  // [Edit mode]
  it('constructor_WithCustomerData_PrefillsFormAndDisablesDocumentFields', () => {
    const component = createComponent({ customer: existingCustomer });

    expect(component.isEditMode).toBeTrue();
    expect(component.form.get('documentType')?.disabled).toBeTrue();
    expect(component.form.get('documentNumber')?.disabled).toBeTrue();
    expect(component.form.get('name')?.value).toBe(existingCustomer.name);
    expect(component.form.get('address')?.value).toBe(existingCustomer.address);
  });

  // [Invalid form]
  it('save_InvalidForm_DoesNotCloseDialogAndMarksFieldsAsTouched', () => {
    const component = createComponent(null);

    component.save();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
    expect(component.form.get('name')?.touched).toBeTrue();
  });

  // [Create mode, valid form]
  it('save_CreateModeValidForm_ClosesDialogWithFullCreateRequest', () => {
    const component = createComponent(null);

    component.form.setValue({
      documentType: EDocumentType.CedulaCiudadania,
      documentNumber: 123456789,
      name: 'Carlos',
      lastname: 'Ruiz',
      age: 35,
      address: 'Calle 50 #23-10, Barranquilla'
    });

    component.save();

    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith({
      documentType: EDocumentType.CedulaCiudadania,
      documentNumber: 123456789,
      name: 'Carlos',
      lastname: 'Ruiz',
      age: 35,
      address: 'Calle 50 #23-10, Barranquilla'
    });
  });

  // [Edit mode, valid form]
  it('save_EditModeValidForm_ClosesDialogWithOnlyEditableFields', () => {
    const component = createComponent({ customer: existingCustomer });

    component.form.get('name')?.setValue('Carlos Andrés');
    component.form.get('address')?.setValue('Calle 72 #10-45, Barranquilla');

    component.save();

    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith({
      name: 'Carlos Andrés',
      lastname: existingCustomer.lastname,
      age: existingCustomer.age,
      address: 'Calle 72 #10-45, Barranquilla'
    });
  });

  // [Cancel]
  it('cancel_Always_ClosesDialogWithoutValue', () => {
    const component = createComponent(null);

    component.cancel();

    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith();
  });

  // [Invalid submit]
  it('save_InvalidForm_ShowsErrorNotificationAndDoesNotClose', () => {
    const component = createComponent(null);

    component.save();

    expect(notificationServiceSpy.error).toHaveBeenCalledOnceWith(
      'Complete los campos obligatorios para continuar.',
      'Formulario incompleto'
    );
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
});
