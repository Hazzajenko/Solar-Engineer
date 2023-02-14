import { BlockType, PanelModel, TrayModel } from '@shared/data-access/models'

export type SelectStart = {
  action: 'SELECT_START'
  data: {
    location: string
  }
}

export type SelectFinish = {
  action: 'SELECT_FINISH'
  data: {
    location: string
    ids: string[]
  }
}

export type CreateStartPanel = {
  action: 'CREATE_START_PANEL'
  data: {
    location: string
    type: BlockType
  }
}

export type CreateFinishPanel = {
  action: 'CREATE_FINISH_PANEL'
  data: {
    location: string
    type: BlockType
    panels: PanelModel[]
  }
}

export type CreateStartTray = {
  action: 'CREATE_START_TRAY'
  data: {
    location: string
    type: BlockType
  }
}

export type CreateFinishTray = {
  action: 'CREATE_FINISH_TRAY'
  data: {
    location: string
    type: BlockType
    trays: TrayModel[]
  }
}

export type DeleteStart = {
  action: 'DELETE_START'
  data: {
    location: string
  }
}

export type DeleteFinish = {
  action: 'DELETE_FINISH'
  data: {
    location: string
    ids: string[]
  }
}

export type MouseActionData =
  | SelectStart
  | SelectFinish
  | CreateStartPanel
  | CreateFinishPanel
  | CreateStartTray
  | CreateFinishTray
  | DeleteStart
  | DeleteFinish
