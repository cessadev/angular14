import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSimulationDialogComponent } from './loan-simulation-dialog.component';

describe('LoanSimulationDialogComponent', () => {
  let component: LoanSimulationDialogComponent;
  let fixture: ComponentFixture<LoanSimulationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanSimulationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanSimulationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
