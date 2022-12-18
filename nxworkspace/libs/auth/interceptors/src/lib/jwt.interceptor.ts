import { Injectable } from '@angular/core'
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs'
import { AuthService } from '@auth/data-access/api'
import { Store } from '@ngrx/store'

import { selectToken } from '@auth/data-access/store'
import { AppState } from '@shared/data-access/store'

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private store: Store<AppState>) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.store.select(selectToken).subscribe((token) => {
      if (token) {
        // console.log(token);
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
        // console.log(token);
      }
    })

    return next.handle(request)
  }
}
