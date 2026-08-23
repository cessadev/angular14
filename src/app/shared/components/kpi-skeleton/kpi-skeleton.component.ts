import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-skeleton',
  templateUrl: './kpi-skeleton.component.html',
  styleUrls: ['./kpi-skeleton.component.scss']
})
export class KpiSkeletonComponent {
  @Input() count = 6;

  get cardIndexes(): number[] {
    return Array.from({ length: this.count });
  }
}
