import { Component, EventEmitter, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { fadeRight, goRight, goRight2, increaseWidthAnimation } from './animation'

@Component({
  selector: 'app-narrow-mat-sidenav',
  templateUrl: 'narrow-mat-sidenav.component.html',
  styles: [],
  imports: [CommonModule],
  standalone: true,
  animations: [fadeRight, goRight, goRight2, increaseWidthAnimation],
})
export class NarrowMatSidenavComponent {
  style = 1
  @Output() opened = new EventEmitter<boolean>()
  isOpened = false
  goRight = false

  open() {
    // this.isOpened = true
    this.goRight = !this.goRight
    this.opened.emit(this.goRight)
  }
}
