import { BaseEventReturnType, SharedEventActions } from '../grid.event'

type DropEventActionModule = typeof import('./constants/drop.constants')
export type DropEventAction =
  | DropEventActionModule[keyof DropEventActionModule]
  | SharedEventActions

export type DropEventReturnType = BaseEventReturnType & {
  action: DropEventAction
}

