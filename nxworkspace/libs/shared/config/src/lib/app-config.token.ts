import { InjectionToken, ValueProvider } from '@angular/core';
import { AppConfig } from './app.config'
export const APP_CONFIG = new InjectionToken<AppConfig>('solarengineer.config');

export const getAppConfigProvider = (value: AppConfig): ValueProvider => ({
  provide: APP_CONFIG,
  useValue: value
});
