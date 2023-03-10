import { LoggerService } from './'

export class Logger {
  private logger: LoggerService
  source = this.constructor.name

  constructor(logger: LoggerService) {
    this.logger = logger
  }

  logDebug(...objects: unknown[]): void {
    const source =
      new Error().stack?.split('\n')[1].trim().split(' ')[1] ?? `${this.source}.logDebug`
    this.logger.debug(source, ...objects)
  }

  logError(...objects: unknown[]): void {
    const source =
      new Error().stack?.split('\n')[1].trim().split(' ')[1] ?? `${this.source}.logDebug`
    this.logger.error(source, ...objects)
    throw new Error(objects.join(' '))
  }
}
