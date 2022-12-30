import { SharedActionData } from '../../types/shared.types'
import { LinkActionData } from '../../types/links/links.types'
import { BaseEventFactoryModelV2 } from '../utils/grid.factory'

export type LinksEventAction = LinkActionData | SharedActionData

export type LinksEventResult = {
  payload: LinksEventAction
}

export class LinksEventFactory implements BaseEventFactoryModelV2 {
  action(payload: LinksEventAction): LinksEventResult {
    return {
      payload,
    } as LinksEventResult
  }
  error(error: string): LinksEventResult {
    return {
      payload: {
        action: 'ERROR',
        data: {
          error,
        },
      },
    } as LinksEventResult
  }
  fatal(fatal: string): LinksEventResult {
    return {
      payload: {
        action: 'FATAL',
        data: {
          fatal,
        },
      },
    } as LinksEventResult
  }
}
