/*
 import { inject, Injectable } from '@angular/core'
 import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
 import { Observable, switchMap, take } from 'rxjs'
 import { ProjectsStoreService } from '@projects/data-access'

 // import { ProjectState, selectCurrentProjectId } from '@grid-layout/data-access'

 @Injectable()
 export class CurrentProjectInterceptor implements HttpInterceptor {
 /!*
 constructor(private store: Store<ProjectState>) {
 }
 *!/
 private projectsStore = inject(ProjectsStoreService)

 intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
 return this.projectsStore.select.projectFromRoute$.pipe(
 take(1),
 switchMap((project) => {
 if (!project) {
 return next.handle(request)
 }
 const headers = request.headers.set('Project', `Project ${project.id}`)
 const projectReq = request.clone({
 headers,
 })
 return next.handle(projectReq)
 }),
 )
 }
 }
 */
