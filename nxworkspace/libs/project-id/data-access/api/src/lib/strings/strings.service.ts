import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { PanelModel, StringModel } from '@shared/data-access/models'
import { DeletePanelResponse, PanelResponse } from 'libs/project-id/data-access/api/src/lib/panels'
import { EMPTY, Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { DeleteStringResponse, ManyStringsResponse, StringResponse } from './strings.response'

@Injectable({
  providedIn: 'root',
})
export class StringsService {
  private http = inject(HttpClient)

  addString(string: StringModel): Observable<StringModel> {
    return this.http.post<StringResponse>(`/api/projects/${string.projectId}/string`, {
      ...string,
      color: 'orange',
    }).pipe(
      map((res: StringResponse) => res.string),
    )
  }

  getStringsByProjectId(projectId: number): Observable<StringModel[]> {
    return this.http.get<ManyStringsResponse>(`/api/projects/${projectId}/strings`).pipe(
      /*      catchError((err) => {
              console.log(err)
              return EMPTY
            }),*/
      map((res: ManyStringsResponse) => res.strings),
    )
  }

  updateString(update: Update<StringModel>, projectId: number) {
    return this.http.put<StringResponse>(`/api/projects/${projectId}/string/${update.id}`, {
      ...update,
    }).pipe(
      map((res: StringResponse) => res.string),
    )
  }

  deleteString(stringId: string, projectId: number) {
    return this.http.delete<DeleteStringResponse>(`/api/projects/${projectId}/string/${stringId}`).pipe(
      map((res: DeleteStringResponse) => res.stringId),
    )
  }
}
