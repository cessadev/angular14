import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPaymentsComponent } from './loan-payments.component';

describe('LoanPaymentsComponent', () => {
  let component: LoanPaymentsComponent;
  let fixture: ComponentFixture<LoanPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
