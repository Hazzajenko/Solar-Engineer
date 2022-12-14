import { Component, OnInit } from '@angular/core'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { NgForOf } from '@angular/common'

@Component({
  selector: 'app-draggable-grid-component',
  templateUrl: 'draggable-grid.component.html',
  styleUrls: ['draggable-grid.component.scss'],
  imports: [DragDropModule, NgForOf],
  standalone: true,
})
export class DraggableGridComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  numSequence(n: number): Array<number> {
    return Array(n)
  }

  isDisabled($event: any) {
    return undefined
  }
}
