import { PanelModel } from '@shared/data-access/models'

export type CreatePanel = {
  action: 'CREATE_PANEL'
  data: {
    panel: PanelModel
  }
}

export type SelectPanel = {
  action: 'SELECT_PANEL'
  data: {
    panelId: string
  }
}

export type ClearSelectedState = {
  action: 'CLEAR_SELECTED_STATE'
  data: {
    log: string
  }
}

export type SelectPanelWhenStringSelected = {
  action: 'SELECT_PANEL_WHEN_STRING_SELECTED'
  data: {
    panelId: string
  }
}

export type AddPanelToMultiselect = {
  action: 'ADD_PANEL_TO_MULTISELECT'
  data: {
    panelId: string
  }
}

export type DeletePanel = {
  action: 'DELETE_PANEL'
  data: {
    panelId: string
  }
}

export type SelectSelectMode = {
  action: 'SELECT_SELECT_MODE'
  data: {
    log: string
  }
}

export type ClickActionData =
  | CreatePanel
  | SelectPanel
  | ClearSelectedState
  | SelectPanelWhenStringSelected
  | AddPanelToMultiselect
  | DeletePanel
  | SelectSelectMode
