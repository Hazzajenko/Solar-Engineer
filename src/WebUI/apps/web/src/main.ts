// import { mainTsProviders } from '@app/config'
import { environment } from '@shared/environment'

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

/*
 bootstrapApplication(AppComponent, {
 providers: [...mainTsProviders],
 }).catch((err) => console.error(err))*/
