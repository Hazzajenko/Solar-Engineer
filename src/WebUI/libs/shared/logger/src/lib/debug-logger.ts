import { LogLevel } from './log-level'
import { LogOutput } from './log-output'

export class DebugLogger {
  static level = LogLevel.Debug

  static outputs: LogOutput[] = []

  constructor(private source: string) {}

  static enableProductionMode() {
    DebugLogger.level = LogLevel.Warning
  }

  debug(source: string, ...objects: unknown[]) {
    this.log(console.log, LogLevel.Debug, source, objects)
  }

  error(source: string, ...objects: unknown[]) {
    const stackTrace =
      new Error().stack?.split('\n')[1].trim().split(' ')[1] ?? `${this.source}.error`
    this.log(console.error, LogLevel.Error, source, [objects, stackTrace])
    throw new Error(objects.join(' '))
  }

  private log(
    func: (...args: unknown[]) => void,
    level: LogLevel,
    source: string,
    objects: unknown[],
  ) {
    if (level <= DebugLogger.level) {
      const log = source ? ['[' + source + ']'].concat(objects as never) : objects
      func.apply(console, log)
      DebugLogger.outputs.forEach((output) => output.apply(output, [source, level, ...objects]))
    }
  }
}