import { Inject, Injectable, Optional } from '@angular/core'
import { LogLevel } from './log-level'
import { LogOutput } from './log-output'
import { LogOptions } from './log-options'

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  static level = LogLevel.Debug

  static outputs: LogOutput[] = []

  static enableProductionMode() {
    LoggerService.level = LogLevel.Warning
  }

  /*
    constructor(@Inject('source') @Optional() public source?: string) {
    }*/

  debug(options: LogOptions) {
    this.log(console.log, LogLevel.Debug, options.source, options.objects)
  }

  /*  debug(...objects: any[]) {
      this.log(console.log, LogLevel.Debug, objects)
    }*/

  info(options: LogOptions) {
    this.log(console.info, LogLevel.Info, options.source, options.objects)
  }

  warn(options: LogOptions) {
    this.log(console.warn, LogLevel.Warning, options.source, options.objects)
  }

  error(options: LogOptions) {
    this.log(console.error, LogLevel.Error, options.source, options.objects)
  }

  private log(func: (...args: any[]) => void, level: LogLevel, source: string, objects: any[]) {
    if (level <= LoggerService.level) {
      const log = source ? ['[' + source + ']'].concat(objects) : objects
      func.apply(console, log)
      LoggerService.outputs.forEach((output) => output.apply(output, [source, level, ...objects]))
    }
  }

  /*  private log(func: (...args: any[]) => void, level: LogLevel, objects: any[]) {
      if (level <= LoggerService.level) {
        const log = this.source ? ['[' + this.source + ']'].concat(objects) : objects
        func.apply(console, log)
        LoggerService.outputs.forEach((output) => output.apply(output, [this.source, level, ...objects]))
      }
    }*/
}