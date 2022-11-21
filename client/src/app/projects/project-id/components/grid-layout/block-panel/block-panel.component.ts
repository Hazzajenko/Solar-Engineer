import { Component, Input } from '@angular/core'
import { PanelModel } from '../../../../models/panel.model'
import { BlockModel } from '../../../../models/block.model'
import { UnitModel } from '../../../../models/unit.model'
import { StringModel } from '../../../../models/string.model'
import { GridMode } from '../../../../store/grid/grid-mode.model'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatTooltipModule } from '@angular/material/tooltip'
import { NgIf, NgStyle } from '@angular/common'
import { FindPanelLocationPipe } from '../../../../../pipes/find-panel-location.pipe'

@Component({
  selector: 'app-block-panel',
  templateUrl: './block-panel.component.html',
  styleUrls: ['./block-panel.component.scss'],
  imports: [
    DragDropModule,
    MatTooltipModule,
    NgStyle,
    NgIf,
    FindPanelLocationPipe,
  ],
  standalone: true,
})
export class BlockPanelComponent {
  @Input() panels?: PanelModel[]
  @Input() block?: BlockModel
  @Input() grid?: {
    createMode?: UnitModel
    selectedStrings?: StringModel[]
    selectedString?: StringModel
    gridMode?: GridMode
  }

  constructor() {}
}
