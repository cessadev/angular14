import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-skeleton',
  templateUrl: './table-skeleton.component.html',
  styleUrls: ['./table-skeleton.component.scss']
})
export class TableSkeletonComponent {
  @Input() gridClass = '';
  @Input() columns = 5;
  @Input() rows = 6;
  @Input() lastColumnNarrow = true;

  get rowIndexes(): number[] {
    return Array.from({ length: this.rows });
  }

  get columnIndexes(): number[] {
    return Array.from({ length: this.columns });
  }
}
