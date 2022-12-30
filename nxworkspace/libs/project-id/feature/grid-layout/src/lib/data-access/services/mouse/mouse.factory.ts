import { MouseActionData } from '../../types/mouse/mouse.types'
import { SharedActionData } from '../../types/shared.types'

import { BaseEventFactoryModelV2 } from '../utils/grid.factory'

export type MouseEventAction = MouseActionData | SharedActionData

export type MouseEventResult = {
  payload: MouseEventAction
}

export class MouseEventFactory implements BaseEventFactoryModelV2 {
  action(payload: MouseEventAction): MouseEventResult {
    return {
      payload,
    } as MouseEventResult
  }
  error(error: string): MouseEventResult {
    return {
      payload: {
        action: 'ERROR',
        data: {
          error,
        },
      },
    } as MouseEventResult
  }
  fatal(fatal: string): MouseEventResult {
    return {
      payload: {
        action: 'FATAL',
        data: {
          fatal,
        },
      },
    } as MouseEventResult
  }
}
