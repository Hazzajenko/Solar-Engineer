import { ClickActionData } from '../../types/click/click.types'
import { SharedActionData } from '../../types/shared.types'
import { LinksEventResult } from '../links/links.factory'
import { BaseEventFactoryModelV2 } from '../utils/grid.factory'

export type ClickEventAction = ClickActionData | SharedActionData

export type ClickEventResult = {
  payload: ClickEventAction
}

export type ClickOrLinkResult = ClickEventResult | LinksEventResult

export class ClickEventFactory implements BaseEventFactoryModelV2 {
  action(payload: ClickEventAction): ClickEventResult {
    return {
      payload,
    } as ClickEventResult
  }
  error(error: string): ClickEventResult {
    return {
      payload: {
        action: 'ERROR',
        data: {
          error,
        },
      },
    } as ClickEventResult
  }
  fatal(fatal: string): ClickEventResult {
    return {
      payload: {
        action: 'FATAL',
        data: {
          fatal,
        },
      },
    } as ClickEventResult
  }
}
