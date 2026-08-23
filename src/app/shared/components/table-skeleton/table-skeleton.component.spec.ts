import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { TableSkeletonComponent } from './table-skeleton.component';

describe('TableSkeletonComponent', () => {
  let component: TableSkeletonComponent;
  let fixture: ComponentFixture<TableSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CommonModule ],
      declarations: [ TableSkeletonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the configured number of rows and columns', () => {
    component.rows = 4;
    component.columns = 6;
    component.gridClass = 'table--loans';
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.skeleton-row');
    expect(rows.length).toBe(4);

    const bonesInFirstRow = rows[0].querySelectorAll('.skeleton-bone');
    expect(bonesInFirstRow.length).toBe(6);
  });

  it('should mark the last cell as narrow when lastColumnNarrow is true', () => {
    component.rows = 1;
    component.columns = 3;
    component.lastColumnNarrow = true;
    fixture.detectChanges();

    const bones = fixture.nativeElement.querySelectorAll('.skeleton-bone');
    expect(bones[bones.length - 1].classList).toContain('skeleton-bone--narrow');
  });
});
