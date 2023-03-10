import { Injectable } from '@angular/core'
import { LogLevel } from './log-level'
import { LogOutput } from './log-output'

// import { LoggerService } from './'

@Injectable({
  providedIn: 'root',
})
export class LoggerV2Service {
  static level = LogLevel.Debug
  static outputs: LogOutput[] = []
  source = this.constructor.name

  static enableProductionMode() {
    LoggerV2Service.level = LogLevel.Warning
  }

  debug(source: string, ...objects: any) {
    this.log(console.log, LogLevel.Debug, source, objects)
  }

  error(source: string, ...objects: any) {
    this.log(console.error, LogLevel.Error, source, objects)
  }

  private log(func: (...args: any[]) => void, level: LogLevel, source: string, objects: any[]) {
    if (level <= LoggerV2Service.level) {
      const log = source ? ['[' + source + ']'].concat(objects) : objects
      func.apply(console, log)
      LoggerV2Service.outputs.forEach((output) => output.apply(output, [source, level, ...objects]))
    }
  }
}
