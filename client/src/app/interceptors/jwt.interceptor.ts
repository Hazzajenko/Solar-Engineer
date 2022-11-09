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

  token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsic29sYXJlbmdpbmVlci5kZXYiXSwiZXhwIjoxNjY4MDcxMDMzLCJuYmYiOjE2Njc5ODQ2MzMsImlhdCI6MTY2Nzk4NDYzMywianRpIjoiMSIsImlzcyI6InNvbGFyZW5naW5lZXIuZGV2IiwibmFtZSI6ImhhcnJ5Iiwic3ViIjoiMSJ9.X5pfkN7Wpq5lQZxVC-_PUVNpD1hoiIovPTrkNt_kpV4';

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.store.select(selectToken).subscribe((token) => {
      if (token) {
        console.log(token);
        request = request.clone({
          setHeaders: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            // Authorization: 'Bearer ' + token,
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(token);
      }
    });

    return next.handle(request);
  }
}
