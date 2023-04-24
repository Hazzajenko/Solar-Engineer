import { TransformedPoint } from '../../../../types'

export type StartSelectionBox = {
  type: 'StartSelectionBox'
  payload: {
    point: TransformedPoint
  }
}

export type SelectionBoxCompleted = {
  type: 'SelectionBoxCompleted'
  payload: {
    // point: TransformedPoint
    ids: string[]
  }
}

export type SelectionBoxCancelled = {
  type: 'SelectionBoxCancelled'
  payload: null
}

export type XStateDragBoxEvent = StartSelectionBox | SelectionBoxCompleted | SelectionBoxCancelled