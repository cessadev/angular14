import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLoansDialogComponent } from './customer-loans-dialog.component';

describe('CustomerLoansDialogComponent', () => {
  let component: CustomerLoansDialogComponent;
  let fixture: ComponentFixture<CustomerLoansDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerLoansDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerLoansDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
