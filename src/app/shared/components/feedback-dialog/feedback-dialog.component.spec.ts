import { FeedbackDialogComponent, FeedbackDialogData } from './feedback-dialog.component';

describe('FeedbackDialogComponent', () => {
  // [Success variant]
  it('constructor_SuccessData_ExposesInjectedDialogData', () => {
    const data: FeedbackDialogData = {
      type: 'success',
      title: 'Operación exitosa',
      message: 'Cliente creado correctamente'
    };

    const component = new FeedbackDialogComponent(data);

    expect(component.data).toEqual(data);
  });

  // [Error variant]
  it('constructor_ErrorData_ExposesInjectedDialogData', () => {
    const data: FeedbackDialogData = {
      type: 'error',
      title: 'No se pudo completar la operación',
      message: 'El vehículo ya tiene un crédito activo'
    };

    const component = new FeedbackDialogComponent(data);

    expect(component.data).toEqual(data);
  });
});
