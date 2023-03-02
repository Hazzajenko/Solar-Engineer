import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { ManyPanelsResponse } from '@project-id/data-access/api'
import { PanelModel, PathModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { DeletePathResponse, ManyPathsResponse, PathResponse } from './paths.response'

@Injectable({
  providedIn: 'root',
})
export class PathsService {
  private http = inject(HttpClient)

  addPath(path: PathModel, projectId: string): Observable<PathModel> {
    return this.http
      .post<PathResponse>(`/api/projects/${projectId}/path`, {
        ...path,
      })
      .pipe(map((res: PathResponse) => res.path))
  }

  getPathsByProjectId(projectId: string): Observable<PathModel[]> {
    return this.http.get<ManyPathsResponse>(`/api/projects/${projectId}/paths`).pipe(
      /*      catchError((err) => {
              console.log(err)
              return EMPTY
            }),*/
      map((res: ManyPathsResponse) => res.paths),
    )
  }

  updatePath(update: Update<PathModel>, projectId: string) {
    return this.http
      .put<PathResponse>(`/api/projects/${projectId}/path/${update.id}`, {
        ...update,
      })
      .pipe(map((res: PathResponse) => res.path))
  }

  deletePath(pathId: string, projectId: string) {
    return this.http
      .delete<DeletePathResponse>(`/api/projects/${projectId}/path/${pathId}`)
      .pipe(map((res: DeletePathResponse) => res.pathId))
  }
}
