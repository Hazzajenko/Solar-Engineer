import { BaseEventReturnType, SharedEventActions } from '../grid.event'

export type MouseEventRequest = {
  event: MouseEvent
  location: string
}

/* type MouseEventActionModule = typeof import('./constants/mouse.constants')
export type MouseEventAction =
  | MouseEventActionModule[keyof MouseEventActionModule]
  | SharedEventActions

export type MouseEventReturnType = BaseEventReturnType & {
  action: MouseEventAction
}
 */
