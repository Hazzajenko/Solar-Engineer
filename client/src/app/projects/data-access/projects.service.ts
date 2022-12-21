import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpEvent } from '@angular/common/http'
import { catchError, map, switchMap, take } from 'rxjs/operators'
import { defer, EMPTY, from, Observable } from 'rxjs'
import { ProjectModel } from '../../shared/models/projects/project.model'

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
    return this.http.get<ProjectModel[]>('/api/projects').pipe(
      catchError((err) => {
        console.log(err)
        return EMPTY
      }),
      map((res: ProjectModel[]) => res),
    )
  }
}
