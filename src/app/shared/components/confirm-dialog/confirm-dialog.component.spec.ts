import { MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent, boolean>>;
  const data: ConfirmDialogData = {
    title: 'Eliminar cliente',
    message: '¿Seguro que desea eliminar a Carlos Ruiz?'
  };

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<ConfirmDialogComponent, boolean>>('MatDialogRef', ['close']);
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
