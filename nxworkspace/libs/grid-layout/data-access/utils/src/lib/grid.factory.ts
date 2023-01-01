

import { Injectable } from '@angular/core'
import { GridEventAction, GridEventResult } from '@grid-layout/data-access/actions'

export interface BaseEventFactoryModel {
  action(action: GridEventAction): GridEventResult
  error(error: string): GridEventResult
  fatal(fatal: string): GridEventResult
}

@Injectable({
  providedIn: 'root',
})
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
