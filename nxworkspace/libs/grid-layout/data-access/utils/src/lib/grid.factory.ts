/* interface GridEventFactoryModel {
  mouseEvents(): MouseEventFactory
  dropEvents(): DropEventFactory
  clickEvents(): ClickEventFactory
  linksEvents(): LinksEventFactory
}

export class GridEventFactory implements GridEventFactoryModel {
  public mouseEvents() {
    return new MouseEventFactory()
  }

  public dropEvents() {
    return new DropEventFactory()
  }

  public clickEvents() {
    return new ClickEventFactory()
  }

  public linksEvents() {
    return new LinksEventFactory()
  }
}
 */
/* type GridEventAction =
  | LinkActionData
  | ClickActionData
  | MouseActionData
  | DropActionData
  | SharedActionData

export type GridEventResult = {
  payload: GridEventAction
} */

import { GridEventAction, GridEventResult } from '@grid-layout/data-access/actions'

export interface BaseEventFactoryModel {
  action(action: GridEventAction): GridEventResult
  error(error: string): GridEventResult
  fatal(fatal: string): GridEventResult
}

export class GridEventFactory implements BaseEventFactoryModel {
  action(payload: GridEventAction): GridEventResult {
    return {
      payload,
    } as GridEventResult
  }
  error(error: string): GridEventResult {
    return {
      payload: {
        action: 'ERROR',
        data: {
          error,
        },
      },
    } as GridEventResult
  }
  fatal(fatal: string): GridEventResult {
    return {
      payload: {
        action: 'FATAL',
        data: {
          fatal,
        },
      },
    } as GridEventResult
  }
}
