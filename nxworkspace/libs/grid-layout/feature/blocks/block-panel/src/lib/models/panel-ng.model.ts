export interface PanelNgModel {
  isSelectedPanel: SelectedPanelType
  isSelectedPositiveTo: boolean
  isSelectedNegativeTo: boolean
  isSelectedString: boolean
  isPanelToLink: boolean
}

export enum SelectedPanelType {
  NOT_SELECTED,
  SINGLE_SELECTED,
  MULTI_SELECETED
}