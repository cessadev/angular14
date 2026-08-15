import { DialogRef } from '@angular/cdk/dialog';
import { FeedbackDialogComponent, FeedbackDialogData } from './feedback-dialog.component';

describe('FeedbackDialogComponent', () => {
  let dialogRefSpy: jasmine.SpyObj<DialogRef<void, FeedbackDialogComponent>>;

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj<DialogRef<void, FeedbackDialogComponent>>('DialogRef', ['close']);
  });

  // [Success variant]
  it('constructor_SuccessData_ExposesInjectedDialogData', () => {
    const data: FeedbackDialogData = {
      type: 'success',
      title: 'Operación exitosa',
      message: 'Cliente creado correctamente'
    };

    const component = new FeedbackDialogComponent(dialogRefSpy, data);

    expect(component.data).toEqual(data);
  });

  // [Error variant]
  it('constructor_ErrorData_ExposesInjectedDialogData', () => {
    const data: FeedbackDialogData = {
      type: 'error',
      title: 'No se pudo completar la operación',
      message: 'El vehículo ya tiene un crédito activo'
    };

    const component = new FeedbackDialogComponent(dialogRefSpy, data);

    expect(component.data).toEqual(data);
  });
});
