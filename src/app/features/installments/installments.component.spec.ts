import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentsComponent } from './installments.component';

describe('InstallmentsComponent', () => {
  let component: InstallmentsComponent;
  let fixture: ComponentFixture<InstallmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
