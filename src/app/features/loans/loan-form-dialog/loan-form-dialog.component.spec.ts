import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanFormDialogComponent } from './loan-form-dialog.component';

describe('LoanFormDialogComponent', () => {
  let component: LoanFormDialogComponent;
  let fixture: ComponentFixture<LoanFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
