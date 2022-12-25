import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { PanelLinkModel } from '@shared/data-access/models'
import { EMPTY, Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { GetLinksResponse } from './get-links.response'

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  private http = inject(HttpClient)

  getLinksByProjectId(projectId: number): Observable<PanelLinkModel[]> {
    return this.http.get<GetLinksResponse>(`/api/projects/${projectId}/links`).pipe(
      catchError((err) => {
        console.log(err)
        return EMPTY
      }),
      map((res: GetLinksResponse) => res.links),
    )
  }
}
