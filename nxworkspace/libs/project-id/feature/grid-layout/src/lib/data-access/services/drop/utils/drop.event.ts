type DropEventAction =
  | 'BLOCK_TAKEN'
  | 'UPDATE_PANEL'
  | 'UNDEFINED'
  | 'ERROR'

interface DropEventReturnOptions {
  action: DropEventAction
  result: boolean
  error?: string
}

export class DropEventReturn {
  action: DropEventAction
  result: boolean
  error?: string

  constructor(options: DropEventReturnOptions) {
    this.action = options.action
    this.result = options.result
    if (options.error) {
      console.error(options)
    }
  }
}
