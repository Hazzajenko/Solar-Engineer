import { Component, Input } from '@angular/core'
import { SurroundingModel } from '../../pipes/get-cable-surroundings.pipe'
import { NgIf } from '@angular/common'

@Component({
  selector: 'app-cable-join',
  templateUrl: './cable-join.component.html',
  styleUrls: ['./cable-join.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class CableJoinComponent {
  @Input() surroundings!: SurroundingModel
}
