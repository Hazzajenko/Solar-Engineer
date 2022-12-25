import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { StringModel } from '@shared/data-access/models'
import { EMPTY, Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { GetStringsResponse } from './get-strings.response'

@Injectable({
  providedIn: 'root',
})
export class StringsService {
  private http = inject(HttpClient)

  getStringsByProjectId(projectId: number): Observable<StringModel[]> {
    return this.http.get<GetStringsResponse>(`/api/projects/${projectId}/strings`).pipe(
      catchError((err) => {
        console.log(err)
        return EMPTY
      }),
      map((res: GetStringsResponse) => res.strings),
    )
  }
}
