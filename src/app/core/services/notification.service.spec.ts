import { NotificationService } from './notification.service';
import { FeedbackDialogComponent } from 'src/app/shared/components/feedback-dialog/feedback-dialog.component';
import { Dialog } from '@angular/cdk/dialog';

describe('NotificationService', () => {
  let service: NotificationService;
  let dialogSpy: jasmine.SpyObj<Dialog>;

  beforeEach(() => {
    dialogSpy = jasmine.createSpyObj<Dialog>('Dialog', ['open']);
    service = new NotificationService(dialogSpy);
  });

  // [Success with default title]
  it('success_DefaultTitle_OpensFeedbackDialogWithSuccessType', () => {
    service.success('Cliente creado correctamente');

    expect(dialogSpy.open).toHaveBeenCalledOnceWith(FeedbackDialogComponent, {
      width: '360px',
      data: {
        type: 'success',
        title: 'Operación exitosa',
        message: 'Cliente creado correctamente'
      }
    });
  });

  // [Success with custom title]
  it('success_CustomTitle_OpensFeedbackDialogWithProvidedTitle', () => {
    service.success('Vehículo actualizado', 'Cambios guardados');

    expect(dialogSpy.open).toHaveBeenCalledOnceWith(FeedbackDialogComponent, {
      width: '360px',
      data: {
        type: 'success',
        title: 'Cambios guardados',
        message: 'Vehículo actualizado'
      }
    });
  });

  // [Error with default title]
  it('error_DefaultTitle_OpensFeedbackDialogWithErrorType', () => {
    service.error('El vehículo ya tiene un crédito activo');

    expect(dialogSpy.open).toHaveBeenCalledOnceWith(FeedbackDialogComponent, {
      width: '360px',
      data: {
        type: 'error',
        title: 'No se pudo completar la operación',
        message: 'El vehículo ya tiene un crédito activo'
      }
    });
  });

  // [Error with custom title]
  it('error_CustomTitle_OpensFeedbackDialogWithProvidedTitle', () => {
    service.error('El monto excede el valor comercial', 'Monto inválido');

    expect(dialogSpy.open).toHaveBeenCalledOnceWith(FeedbackDialogComponent, {
      width: '360px',
      data: {
        type: 'error',
        title: 'Monto inválido',
        message: 'El monto excede el valor comercial'
      }
    });
  });
});
