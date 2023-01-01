import { ClickActionData } from './actions/click.actions'
import { DropActionData } from './actions/drop.actions'
import { GridModeActionData } from './actions/grid-mode.actions'
import { LinkActionData } from './actions/links.actions'
import { MultiActionData } from './actions/multi.actions'
import { SharedActionData } from './actions/shared.actions'

export type GridEventAction =
  | LinkActionData
  | ClickActionData
  // | MouseActionData
  | DropActionData
  | GridModeActionData
  | MultiActionData
  | SharedActionData

export type GridEventResult = {
  payload: GridEventAction
}

export type Selected<T> = {
  source: 'SELECTED'
  payload: T
}
