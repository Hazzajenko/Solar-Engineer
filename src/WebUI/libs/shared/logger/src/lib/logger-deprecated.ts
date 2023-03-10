/*export class Logger {
  static level = LogLevel.Debug
  static outputs: LogOutput[] = []

  static enableProductionMode() {
    Logger.level = LogLevel.Warning
  }

  constructor(private source?: string) {}

  debug(...objects: any[]) {
    this.log(console.log, LogLevel.Debug, objects)
  }

  private log(func: (...args: any[]) => void, level: LogLevel, objects: any[]) {
    if (level <= Logger.level) {
      const log = this.source ? ['[' + this.source + ']'].concat(objects) : objects
      func.apply(console, log)
      Logger.outputs.forEach((output) => output.apply(output, [this.source, level, ...objects]))
    }
  }
}

/!*
const log = new Logger('test')
log.debug('test')*!/*/
