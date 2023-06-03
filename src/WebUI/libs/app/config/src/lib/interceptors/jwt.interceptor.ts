import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http'

export const jwtInterceptor = () => {
	const interceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
		const token = localStorage.getItem('token')
		if (!token) {
			return next(req)
		}
		const headers = req.headers.set('Authorization', `Bearer ${token}`)
		const authReq = req.clone({
			headers,
		})
		return next(authReq)
	}

	return interceptor
}
