export type SelectSelectMode = {
  action: 'SELECT_SELECT_MODE'
  data: {
    log: string
  }
}

export type SelectCreateMode = {
  action: 'SELECT_CREATE_MODE'
  data: {
    log: string
  }
}

export type SelectLinkMode = {
  action: 'SELECT_LINK_MODE'
  data: {
    log: string
  }
}

export type SelectDeleteMode = {
  action: 'SELECT_DELETE_MODE'
  data: {
    log: string
  }
}

export type GridModeActionData =
  | SelectSelectMode
  | SelectCreateMode
  | SelectLinkMode
  | SelectDeleteMode
