import { PanelLinkModel } from '@shared/data-access/models'

export type AddLink = {
  action: 'ADD_LINK'
  data: {
    link: PanelLinkModel
    shiftKey: boolean
  }
}

export type StartLinkPanel = {
  action: 'START_LINK_PANEL'
  data: {
    panelId: string
  }
}

export type ClearGridState = {
  action: 'CLEAR_GRID_STATE'
  data: {
    log: string
  }
}

export type LinkActionData = AddLink | StartLinkPanel | ClearGridState
