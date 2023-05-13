import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable, Provider } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable()
export class AddCookieInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const request = req.clone({
      withCredentials: true,
    })
    return next.handle(request)
  }
}

export const AddCookieInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AddCookieInterceptor,
  multi: true,
}
