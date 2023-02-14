export type Undefined = {
  action: 'UNDEFINED'
  data: {
    log: string
  }
}

export type Error = {
  action: 'ERROR'
  data: {
    error: string
  }
}

export type Fatal = {
  action: 'FATAL'
  data: {
    fatal: string
  }
}

export type SharedActionData = Undefined | Error | Fatal
