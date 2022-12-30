import { ClickActionData } from '../../types/click/click.types'
import { DropActionData } from '../../types/drop/drop.types'
import { LinkActionData } from '../../types/links/links.types'
import { MouseActionData } from '../../types/mouse/mouse.types'
import { SharedActionData } from '../../types/shared.types'
import { ClickEventAction, ClickEventReturnType } from './events/click.event'
import { DropEventAction, DropEventReturnType } from './events/drop.event'


type SharedEventActionModule = typeof import('./events/constants/shared.constants')
export type SharedEventActions = SharedEventActionModule[keyof SharedEventActionModule]

export type BaseEventReturnType = {
  result: boolean
  error?: string
}
// type EventAction = MouseEventAction | DropEventAction | ClickEventAction

// type GridEventReturnType = MouseEventReturnType | DropEventReturnType | ClickEventReturnType
/*
export interface BaseEventFactoryModel {
  action(action: EventAction): GridEventReturnType
  undefined(): GridEventReturnType
  error(error: string): GridEventReturnType
}
 */

/* export class LinksEventFactory {
  action(payload: LinkEventActionResult): LinksEventResult {
    return {
      payload,
    } as LinksEventResult
  }
  error(error: string): LinksEventResult {
    return {
      payload: {
        action: 'ERROR',
        data: {
          error
        }
      },
    } as LinksEventResult
  }
  fatal(fatal: string): LinksEventResult {
    return {
      payload: {
        action: 'FATAL',
        data: {
          fatal
        }
      },
    } as LinksEventResult
  }
} */

/* export class BaseEventFactory implements BaseEventFactoryModel {
  action(action: EventAction): GridEventReturnType {
    return {
      action,
      result: true,
    } as GridEventReturnType
  }
  undefined(): GridEventReturnType {
    return {
      action: 'UNDEFINED',
      result: false,
    } as GridEventReturnType
  }
  error(error: string): GridEventReturnType {
    console.error(error)
    return {
      action: 'ERROR',
      result: false,
      error,
    } as GridEventReturnType
  }
}
 */
