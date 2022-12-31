import { ClickActionData } from './actions/click.actions'
import { DropActionData } from './actions/drop.actions'
import { LinkActionData } from './actions/links.actions'
import { MouseActionData } from './actions/mouse.actions'
import { SharedActionData } from './actions/shared.actions'

export type GridEventAction =
  | LinkActionData
  | ClickActionData
  | MouseActionData
  | DropActionData
  | SharedActionData

export type GridEventResult = {
  payload: GridEventAction
}

export type Selected<T> = {
  source: 'SELECTED'
  payload: T
}

