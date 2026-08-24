import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detail-card-skeleton',
  templateUrl: './detail-card-skeleton.component.html',
  styleUrls: ['./detail-card-skeleton.component.scss']
})
export class DetailCardSkeletonComponent {
  @Input() lines = 5;
  @Input() actions = 0;

  get lineIndexes(): number[] {
    return Array.from({ length: this.lines });
  }

  get actionIndexes(): number[] {
    return Array.from({ length: this.actions });
  }
}
