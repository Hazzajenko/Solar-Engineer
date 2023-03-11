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

  throwIfNull<T>(value: T | null | undefined, ...objects: unknown[]): T {
    if (value === null || value === undefined) {
      const source =
        new Error().stack?.split('\n')[1].trim().split(' ')[1] ?? `${this.source}.throwIfNull`
      this.logger.error(source, value, ...objects)
      throw new Error(objects.join(' '))
      // this.logError(message ?? 'Value is null or undefined')
      // throw new Error(message ?? 'Value is null or undefined')
    }
    return value
  }
}
