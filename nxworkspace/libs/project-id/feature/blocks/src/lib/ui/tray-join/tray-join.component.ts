import { NgIf } from '@angular/common'
import { Component, Input } from '@angular/core'
import { SurroundingModel } from '@shared/data-access/models'

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
