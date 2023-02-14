import { Injectable } from '@angular/core'
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '@shared/data-access/store'
import { ProjectState, selectCurrentProjectId } from '@grid-layout/data-access/store'

@Injectable()
export class CurrentProjectInterceptor implements HttpInterceptor {
  constructor(private store: Store<ProjectState>) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.store.select(selectCurrentProjectId).subscribe((project) => {
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
