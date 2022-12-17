import { Component, Input } from '@angular/core'

import { NgIf } from '@angular/common'
import { SurroundingModel } from '../../../../../../../../../../libs/shared/data-access/models/src/lib/surrounding.model'

@Component({
  selector: 'app-tray-join',
  templateUrl: './tray-join.component.html',
  styleUrls: ['./tray-join.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class TrayJoinComponent {
  @Input() surroundings!: SurroundingModel
}
