import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { StringModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { DeleteStringResponse, ManyStringsResponse, StringResponse } from './strings.response'

@Injectable({
  providedIn: 'root',
})
export class StringsService {
  private http = inject(HttpClient)

  addString(string: StringModel): Observable<StringModel> {
    return this.http
      .post<StringResponse>(`/api/projects/${string.projectId}/string`, {
        ...string,
        color: 'orange',
      })
      .pipe(map((res: StringResponse) => res.string))
  }

  getStringsByProjectId(projectId: string): Observable<StringModel[]> {
    return this.http
      .get<ManyStringsResponse>(`/api/projects/${projectId}/strings`)
      .pipe(map((res: ManyStringsResponse) => res.strings))
  }

  updateString(update: Update<StringModel>, projectId: string) {
    return this.http
      .put<StringResponse>(`/api/projects/${projectId}/string/${update.id}`, {
        ...update,
      })
      .pipe(map((res: StringResponse) => res.string))
  }

  deleteString(stringId: string, projectId: string) {
    return this.http
      .delete<DeleteStringResponse>(`/api/projects/${projectId}/string/${stringId}`)
      .pipe(map((res: DeleteStringResponse) => res.stringId))
  }
}
