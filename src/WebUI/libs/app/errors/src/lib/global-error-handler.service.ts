import { ErrorHandler, inject, Injectable } from '@angular/core'
import { ApplicationInsightsService } from '@app/logging'

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
	// private _http = inject(HttpClient)
	private _insights = inject(ApplicationInsightsService)

	handleError(error: any) {
		/*		if (environment.production) {
		 const errorObject = {
		 message: error?.message,
		 stackTrace: error?.stack?.split('\n')[1].trim().split(' ')[1] ?? 'unknown',
		 }

		 await firstValueFrom(this._http.post('/auth/error', errorObject))
		 return
		 }

		 // this._insights.trackTrace(error)*/

		const errorObject = {
			message: error?.message,
			stackTrace: error?.stack?.split('\n')[1].trim().split(' ')[1] ?? 'unknown',
		}
		console.error('GlobalErrorHandler', errorObject)

		console.error('GlobalErrorHandler', error)
		this._insights.logException(error)

		// this._insights
		// if (error?.message?.includes('Cannot match any routes')) {
		// 	this._insights.logPageView('404', '404')
		// }

		// super.handleError(error)
		// this.handleError(error)
		//
		// if (!environment.production) {
		// 	console.error(error)
		// }
	}
}
