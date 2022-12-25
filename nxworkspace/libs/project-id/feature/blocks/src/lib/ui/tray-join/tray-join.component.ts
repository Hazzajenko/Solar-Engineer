import { Component, Input } from '@angular/core'

import { NgIf } from '@angular/common'
import { SurroundingModel } from '@shared/data-access/models'

@Component({
  selector: 'grid-tray-join',
  templateUrl: './tray-join.component.html',
  styleUrls: ['./tray-join.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class TrayJoinComponent {
  @Input() surroundings!: SurroundingModel
}
