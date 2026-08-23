import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { KpiSkeletonComponent } from './kpi-skeleton.component';

describe('KpiSkeletonComponent', () => {
  let component: KpiSkeletonComponent;
  let fixture: ComponentFixture<KpiSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CommonModule ],
      declarations: [ KpiSkeletonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the configured number of placeholder cards', () => {
    component.count = 4;
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.skeleton-kpi-card');
    expect(cards.length).toBe(4);
  });

  it('should render three bones per card (label, value, footnote)', () => {
    component.count = 1;
    fixture.detectChanges();

    const bones = fixture.nativeElement.querySelectorAll('.skeleton-kpi-card .skeleton-bone');
    expect(bones.length).toBe(3);
  });
});
