import { LogLevel } from '../app/services/logger.service'

export const environment = {
  production: true,
  apiUrl: 'http://localhost:3000',
  LOG_LEVEL: LogLevel.ERROR,
}
