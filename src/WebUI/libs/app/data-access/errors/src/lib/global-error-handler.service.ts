import { ErrorHandler, inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import { environment } from '@shared/environment'

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
	private _http = inject(HttpClient)

	async handleError(error: any) {
		if (environment.production) {
			const errorObject = {
				message: error?.message,
				stackTrace: error?.stack?.split('\n')[1].trim().split(' ')[1] ?? 'unknown',
			}

			await firstValueFrom(this._http.post('/auth/error', errorObject))
			return
		}

		console.error(error)
	}
}
