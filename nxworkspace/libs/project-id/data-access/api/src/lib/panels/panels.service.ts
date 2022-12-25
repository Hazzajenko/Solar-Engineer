import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { PanelModel } from '@shared/data-access/models'
import { EMPTY, Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { GetPanelsResponse } from './get-panels.response'

@Injectable({
  providedIn: 'root',
})
export class PanelsService {
  private http = inject(HttpClient)

  getPanelsByProjectId(projectId: number): Observable<PanelModel[]> {
    return this.http.get<GetPanelsResponse>(`/api/projects/${projectId}/panels`).pipe(
      catchError((err) => {
        console.log(err)
        return EMPTY
      }),
      map((res: GetPanelsResponse) => res.panels),
    )
  }
}
