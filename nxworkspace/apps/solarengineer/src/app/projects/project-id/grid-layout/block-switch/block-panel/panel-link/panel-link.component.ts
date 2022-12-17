import { Component, Input } from '@angular/core'
import { NgIf } from '@angular/common'

@Component({
  selector: 'app-panel-link',
  templateUrl: './panel-link.component.html',
  styleUrls: ['./panel-link.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class PanelLinkComponent {
  @Input() isPositiveLink?: boolean
  @Input() isNegativeLink?: boolean
}
