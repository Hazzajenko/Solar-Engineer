import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CdkDrag, CdkDragDrop, CdkDragMove } from '@angular/cdk/drag-drop'
import { FreePanelModel } from '../../free-panel.model'

@Component({
  selector: 'app-free-panel',
  templateUrl: './free-panel.component.html',
  styles: [],
  imports: [
    CommonModule,
    CdkDrag,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FreePanelComponent implements OnInit {
  /*  private _freePanel!: FreePanelModel
   @Input() set freePanel(value: FreePanelModel) {
   console.log('freePanel', value)
   this.dragPosition = { x: value.x, y: value.y }
   }

   get freePanel() {
   return this._freePanel
   }*/

  @Input() freePanel!: FreePanelModel

  savedPosition: { x: number, y: number } = { x: 0, y: 0 }
  rotation = 0
  private _dragPosition: any
  set dragPosition(value: any) {
    console.log('dragPosition', value)
    this._dragPosition = value
  }

  get dragPosition() {
    return this._dragPosition
  }

  ngOnInit() {
    this.dragPosition = { x: this.freePanel.x, y: this.freePanel.y }
  }

  dragDropped(event: CdkDragDrop<FreePanelModel>) {
    // event.preventDefault()
    console.log('dragDropped', event)

  }

  dragMoved(event: CdkDragMove<FreePanelModel>) {
    // event.preventDefault()
    console.log('dragMoved', event)
    this.savedPosition = { x: event.source.getFreeDragPosition().x, y: event.source.getFreeDragPosition().y }
    console.log('savedPosition', this.savedPosition)
  }
}
