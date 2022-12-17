import { Component, HostListener, Input, OnInit } from '@angular/core'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { NgForOf, NgIf, NgStyle } from '@angular/common'
import { SceneModel } from '../../../../../../../../libs/shared/data-access/models/src/lib/scene.model'

@Component({
  selector: 'app-draggable-grid-component',
  templateUrl: 'draggable-grid.component.html',
  styleUrls: ['draggable-grid.component.scss'],
  imports: [DragDropModule, NgForOf, NgIf, NgStyle],
  standalone: true,
})
export class DraggableGridComponent implements OnInit {
  /*  @Input() rows!: number
    @Input() cols!: number*/
  @Input() scene!: SceneModel
  // dragPosition = { x: 0, y: 0 }
  altKeyPressed: boolean = false

  constructor() {}

  ngOnInit() {}

  @HostListener('window:keyup', ['$event'])
  async keyEvent(event: KeyboardEvent) {
    console.log(event)
    if (event.altKey) {
      console.log(event)
      this.altKeyPressed = true
    }
  }

  @HostListener('window:keydown', ['$event'])
  async keyDownEvent(event: KeyboardEvent) {
    console.log(event)
    if (event.altKey) {
      console.log(event)
      this.altKeyPressed = false
    }
  }

  numSequence(n: number): Array<number> {
    return Array(n)
  }

  isDisabled() {
    return !this.altKeyPressed
  }

  altKeyDown(event: KeyboardEvent) {
    if (event.altKey) {
      console.log(event)
      this.altKeyPressed = true
    }
  }

  altKeyUp(event: KeyboardEvent) {
    if (event.altKey) {
      console.log(event)
      this.altKeyPressed = false
    }
  }
}
