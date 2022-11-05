import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';

import { selectToken } from '../auth/store/auth.selectors';
import { AppState } from '../store/app.state';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private store: Store<AppState>) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.store.select(selectToken).subscribe((token) => {
      if (token) {
        request = request.clone({
          setHeaders: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: `Bearer ${token}`,
          },
        });
      }
    });

    return next.handle(request);
  }
}
