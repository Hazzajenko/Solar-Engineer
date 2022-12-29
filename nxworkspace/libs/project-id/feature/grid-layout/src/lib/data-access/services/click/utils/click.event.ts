export interface ClickEventModel {
  event: MouseEvent
  location: string
}

type ClickEventAction =
  | 'CREATE_SWITCH'
  | 'CREATE_PANEL'
  | 'SELECT_PANEL'
  | 'CLEAR_SELECTED'
  | 'UNDEFINED'
  | 'ERROR'

interface ClickEventReturnOptions {
  action: ClickEventAction
  result: boolean
  error?: string
}

export class ClickEventReturn {
  action: ClickEventAction
  result: boolean
  error?: string

  constructor(options: ClickEventReturnOptions) {
    this.action = options.action
    this.result = options.result
    if (options.error) {
      console.error(options)
    }
  }
}
