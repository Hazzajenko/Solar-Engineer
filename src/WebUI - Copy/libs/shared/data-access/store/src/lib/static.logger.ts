import { LogLevel, LogOutput } from '@shared/logger'

export class StaticLogger {
  private timerId: ReturnType<typeof setTimeout> | undefined

  // eslint-disable-next-line @typescript-eslint/member-ordering
  static level = LogLevel.Debug
  // eslint-disable-next-line @typescript-eslint/member-ordering
  static outputs: LogOutput[] = []

  static enableProductionMode() {
    StaticLogger.level = LogLevel.Warning
  }

  constructor(private source?: string) {}

  delayedLog(source: string, ...args: any[]) {
    if (this.timerId) {
      clearTimeout(this.timerId)
    }
    this.timerId = setTimeout(() => {
      console.log(source, ...args)
      this.timerId = undefined
    }, 100) // delay in milliseconds, change as needed
  }

  debug(...objects: any[]) {
    this.log(console.log, LogLevel.Debug, objects)
  }

  private log(func: (...args: any[]) => void, level: LogLevel, objects: any[]) {
    if (level <= StaticLogger.level) {
      const log = this.source ? ['[' + this.source + ']'].concat(objects) : objects
      func.apply(console, log)
      StaticLogger.outputs.forEach((output) =>
        output.apply(output, [this.source, level, ...objects]),
      )
    }
  }
}