import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { DetailCardSkeletonComponent } from './detail-card-skeleton.component';

describe('DetailCardSkeletonComponent', () => {
  let component: DetailCardSkeletonComponent;
  let fixture: ComponentFixture<DetailCardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CommonModule ],
      declarations: [ DetailCardSkeletonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailCardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the configured number of detail lines', () => {
    component.lines = 4;
    fixture.detectChanges();

    const lines = fixture.nativeElement.querySelectorAll('.skeleton-bone--card-line');
    expect(lines.length).toBe(4);
  });

  it('should not render an actions row when actions is 0', () => {
    component.actions = 0;
    fixture.detectChanges();

    const actionsRow = fixture.nativeElement.querySelector('.detail-skeleton-actions');
    expect(actionsRow).toBeNull();
  });

  it('should render the configured number of action button bones', () => {
    component.actions = 2;
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.skeleton-bone--card-button');
    expect(buttons.length).toBe(2);
  });
});
