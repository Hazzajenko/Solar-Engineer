import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { ProjectModel } from '@shared/data-access/models'
import { EMPTY, Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { GetProjectsResponse } from './get-projects.response'

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private http = inject(HttpClient)

  getProjectById(projectId: number): Observable<ProjectModel> {
    return this.http.get<ProjectModel>(`/api/projects/${projectId}`).pipe(
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
