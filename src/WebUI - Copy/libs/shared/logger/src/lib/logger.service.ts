import { Injectable } from '@angular/core'
import { LogLevel } from './log-level'
import { LogOutput } from './log-output'

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  static level = LogLevel.Debug

  static outputs: LogOutput[] = []

  static enableProductionMode() {
    LoggerService.level = LogLevel.Warning
  }

  debug(source: string, ...objects: unknown[]) {
    this.log(console.log, LogLevel.Debug, source, objects)
  }

  error(source: string, ...objects: unknown[]) {
    this.log(console.error, LogLevel.Error, source, objects)
  }

  private log(
    func: (...args: unknown[]) => void,
    level: LogLevel,
    source: string,
    objects: unknown[],
  ) {
    if (level <= LoggerService.level) {
      const log = source ? ['[' + source + ']'].concat(objects as never) : objects
      func.apply(console, log)
      LoggerService.outputs.forEach((output) => output.apply(output, [source, level, ...objects]))
    }
  }
}
