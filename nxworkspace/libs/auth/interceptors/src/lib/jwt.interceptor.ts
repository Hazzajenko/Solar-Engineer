import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { inject, Injectable, Provider } from '@angular/core'
import { AuthFacade } from '@auth/data-access/facades'
import { Observable, switchMap, take } from 'rxjs'

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private authStore = inject(AuthFacade)

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.authStore.token$.pipe(
      take(1),
      switchMap((token) => {
        if (!token) {
          return next.handle(req)
        }
        const headers = req.headers.set('Authorization', `Bearer ${token}`)
        const authReq = req.clone({
          headers,
        })
        return next.handle(authReq)
      }),
    )
  }
}

export const jwtInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true,
}
