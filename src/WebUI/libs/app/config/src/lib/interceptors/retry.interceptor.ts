import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http'
import { retry, RetryConfig } from 'rxjs'

export const retryInterceptor = (config: RetryConfig) => {
	const interceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
		return next(req).pipe(retry(config))
	}

	return interceptor
}
