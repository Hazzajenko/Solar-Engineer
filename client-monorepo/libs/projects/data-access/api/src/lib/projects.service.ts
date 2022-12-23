import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators'
import { EMPTY, Observable } from 'rxjs'
import { ProjectModel } from '@shared/models'
import { GetProjectsResponse } from './get-projects.response'

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private http = inject(HttpClient)

  getProjectById(id: number): Observable<ProjectModel> {
    return this.http.get<ProjectModel>(`/api/projects/${id}`).pipe(
      catchError((err) => {
        console.log(err)
        return EMPTY
      }),
      map((res: ProjectModel) => res),
    )
  }

  getUserProjects(): Observable<ProjectModel[]> {
    return this.http.get<GetProjectsResponse>('/api/projects').pipe(
      catchError((err) => {
        console.log(err)
        return EMPTY
      }),
      map((res: GetProjectsResponse) => res.projects),
    )
  }
}
