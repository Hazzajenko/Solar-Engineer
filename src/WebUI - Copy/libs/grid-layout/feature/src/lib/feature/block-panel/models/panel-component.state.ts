import { PanelSelected } from './panel-selected'
import { BlockType, PathModel, SelectedPathModel } from '@shared/data-access/models'
import { StringSelected } from './string-selected'

export interface PanelComponentState {
  id: string
  stringId: string
  rotation: number
  location: string
  stringName: string
  stringColor: string
  selected: PanelSelected
  stringSelected: StringSelected
  panelPath: PathModel | undefined
  selectedPanelPath: SelectedPathModel | undefined
  isPanelToLink: boolean
  type: BlockType
}
