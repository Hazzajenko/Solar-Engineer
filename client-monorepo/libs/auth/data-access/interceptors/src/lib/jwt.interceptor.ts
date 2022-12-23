import {inject, Injectable} from '@angular/core'
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Observable } from 'rxjs'
import {AuthFacade} from "@auth/facade";



@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private authFacade = inject(AuthFacade)


  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    this.authFacade.token$.subscribe(token => {
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    })

    return next.handle(request)
  }
}
