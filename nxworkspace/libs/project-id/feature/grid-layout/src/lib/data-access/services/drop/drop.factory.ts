import { DropActionData } from '../../types/drop/drop.types'
import { SharedActionData } from '../../types/shared.types'
import { BaseEventFactoryModelV2 } from '../utils/grid.factory'


export type DropEventAction = DropActionData | SharedActionData

export type DropEventResult = {
  payload: DropEventAction
}

export class DropEventFactory implements BaseEventFactoryModelV2 {
  action(payload: DropEventAction): DropEventResult {
    return {
      payload,
    } as DropEventResult
  }
  error(error: string): DropEventResult {
    return {
      payload: {
        action: 'ERROR',
        data: {
          error,
        },
      },
    } as DropEventResult
  }
  fatal(fatal: string): DropEventResult {
    return {
      payload: {
        action: 'FATAL',
        data: {
          fatal,
        },
      },
    } as DropEventResult
  }
}
