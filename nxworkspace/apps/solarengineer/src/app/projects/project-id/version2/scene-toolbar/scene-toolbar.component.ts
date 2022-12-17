import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { SceneModel } from '../../../../../../../../libs/shared/data-access/models/src/lib/scene.model'

@Component({
  selector: 'app-scene-toolbar',
  templateUrl: 'scene-toolbar.component.html',
  styleUrls: ['scene-toolbar.component.scss'],
  imports: [MatButtonModule, MatToolbarModule],
  standalone: true,
})
export class SceneToolbarComponent implements OnInit {
  @Output() addSceneEvent = new EventEmitter<SceneModel>()

  constructor() {}

  ngOnInit() {}

  addScene() {
    const scene = new SceneModel(10, 10, 796, 414)
    this.addSceneEvent.emit(scene)
    // this.addSceneEvent.emit({ rows: 10, cols: 10, xPosition: 0, yPosition: 0 })
  }
}
