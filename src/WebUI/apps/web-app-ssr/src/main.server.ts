import { bootstrapApplication } from '@angular/platform-browser'
import { AppComponent, appConfig } from '@app/config'
import { environment } from '@shared/environment'
import { ApplicationConfig, mergeApplicationConfig } from '@angular/core'
import { provideServerRendering } from '@angular/platform-server'

if (environment.production) {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	window.console.log = () => {}
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	window.console.debug = () => {}
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	window.console.info = () => {}
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	window.console.warn = () => {}
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	window.console.error = () => {}
}

const serverAppConfig: ApplicationConfig = {
	providers: [provideServerRendering()],
}

const serverConfig = mergeApplicationConfig(appConfig, serverAppConfig)

const bootstrap = () => bootstrapApplication(AppComponent, serverConfig)

export default bootstrap
