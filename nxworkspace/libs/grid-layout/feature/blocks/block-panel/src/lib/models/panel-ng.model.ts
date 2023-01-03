import { PanelPathModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'

export interface PanelNgModel {
  isSelectedPanel: SelectedPanelVal
  isSelectedPositiveTo: boolean
  isSelectedNegativeTo: boolean
  stringColor: string | undefined
  isPanelToLink: boolean
  stringSelected: StringSelectedVal
  panelLinkPath: PanelPathModel | undefined
  selectPanelLinkPath: PanelPathModel | undefined
}

export enum SelectedPanelVal {
  NOT_SELECTED,
  SINGLE_SELECTED,
  MULTI_SELECTED
}

export enum StringSelectedVal {
  NOT_SELECTED,
  SELECTED,
  OTHER_SELECTED
}