import { BaseEventReturnType, SharedEventActions } from '../grid.event'
type ClickEventActionModule = typeof import('./constants/click.constants')
export type ClickEventAction =
  | ClickEventActionModule[keyof ClickEventActionModule]
  | SharedEventActions

export type ClickEventReturnType = BaseEventReturnType & {
  action: ClickEventAction
}

