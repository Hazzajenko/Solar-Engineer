import { PanelLinkPath } from '@grid-layout/shared/models'
import { Observable } from 'rxjs'

export interface PanelNgModel {
  isSelectedPanel: SelectedPanelVal
  isSelectedPositiveTo: boolean
  isSelectedNegativeTo: boolean
  stringColor: string | undefined
  isPanelToLink: boolean
  stringSelected: StringSelectedVal
  panelLinkPath: PanelLinkPath | undefined
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