import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { inject, Injectable, Provider } from '@angular/core'
import { Observable, switchMap, take } from 'rxjs'
import { AuthService } from '@auth0/auth0-angular'

@Injectable()
export class Auth0Interceptor implements HttpInterceptor {
  private auth = inject(AuthService)

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.auth.getAccessTokenSilently().pipe(
      take(1),
      switchMap((token) => {
        if (!token) {
          return next.handle(req)
        }
        // const serializable = JSON.stringify(token)
        const headers = req.headers.set('Authorization', `Bearer ${token}`)
        const authReq = req.clone({
          headers,
        })
        return next.handle(authReq)
      }),
    )
  }
}

export const Auth0InterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: Auth0Interceptor,
  multi: true,
}
