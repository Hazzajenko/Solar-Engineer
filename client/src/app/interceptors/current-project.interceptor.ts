import { Injectable } from '@angular/core'
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { selectCurrentId } from '../projects/store/projects/projects.selectors'

@Injectable()
export class CurrentProjectInterceptor implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    this.store.select(selectCurrentId).subscribe((project) => {
      console.log(project)
      if (project) {
        console.log(project)
        request = request.clone({
          setHeaders: {
            // Project: `Project 3`,
            Project: `Project ${project}`,
          },
        })
      }
    })

    return next.handle(request)
  }
}
