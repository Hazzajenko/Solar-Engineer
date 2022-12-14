import { Component, OnInit } from '@angular/core'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { DraggableGridComponent } from './draggable-grid/draggable-grid.component'

@Component({
  selector: 'app-scene-component',
  templateUrl: 'scene.component.html',
  styleUrls: ['scene.component.scss'],
  imports: [DragDropModule, DraggableGridComponent],
  standalone: true,
})
export class SceneComponent implements OnInit {
  dragPosition = { x: 0, y: 0 }
  constructor() {}

  ngOnInit() {}
}
