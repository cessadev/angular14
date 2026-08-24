import { Component, Input } from '@angular/core';

export type IconName =
  | 'add' | 'arrow-back' | 'calculate' | 'delete' | 'edit' | 'menu'
  | 'receipt' | 'quote' | 'search' | 'check-circle' | 'error'
  | 'dashboard' | 'people' | 'car' | 'payments' | 'info'
  | 'sun' | 'moon';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent {
  @Input() name!: IconName;
  @Input() size = 20;
}
