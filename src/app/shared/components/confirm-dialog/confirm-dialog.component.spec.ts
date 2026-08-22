import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';
import { DialogRef } from '@angular/cdk/dialog';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let dialogRefSpy: jasmine.SpyObj<DialogRef<boolean, ConfirmDialogComponent>>;
  const data: ConfirmDialogData = {
    title: 'Eliminar cliente',
    message: '¿Seguro que desea eliminar a Carlos Ruiz?'
  };

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj<DialogRef<boolean, ConfirmDialogComponent>>('DialogRef', ['close']);
    component = new ConfirmDialogComponent(dialogRefSpy, data);
  });

  // [Confirm]
  it('confirm_Always_ClosesDialogWithTrue', () => {
    component.confirm();
    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith(true);
  });

  // [Cancel]
  it('cancel_Always_ClosesDialogWithFalse', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith(false);
  });

  // [Injected data is exposed to the template]
  it('data_Always_ExposesInjectedDialogData', () => {
    expect(component.data).toEqual(data);
  });
});
