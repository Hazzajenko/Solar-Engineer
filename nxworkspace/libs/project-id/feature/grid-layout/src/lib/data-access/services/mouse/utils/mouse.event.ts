/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import { BlockType, PanelModel } from '@shared/data-access/models'

export interface MouseEventModel {
  event: MouseEvent
  location: string
}

type MouseEventAction =
  | 'SELECT_START'
  | 'SELECT_FINISH'
  | 'CREATE_START_PANEL'
  | 'CREATE_FINISH_PANEL'
  | 'CREATE_START_TRAY'
  | 'CREATE_FINISH_TRAY'
  | 'DELETE_START'
  | 'DELETE_FINISH'
  | 'UNDEFINED'
  | 'ERROR'

interface MouseEventReturnOptions {
  action: MouseEventAction
  result: boolean
  error?: string
}

export class MouseEventReturn {
  action: MouseEventAction
  result: boolean
  error?: string

  constructor(options: MouseEventReturnOptions) {
    this.action = options.action
    this.result = options.result
    if (options.error) {
      console.error(options)
    }
  }
}
