import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanInstallmentsComponent } from './loan-installments.component';

describe('LoanInstallmentsComponent', () => {
  let component: LoanInstallmentsComponent;
  let fixture: ComponentFixture<LoanInstallmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanInstallmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanInstallmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
