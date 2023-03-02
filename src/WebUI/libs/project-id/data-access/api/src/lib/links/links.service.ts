import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { PanelLinkModel } from '@shared/data-access/models'
import {
  DeleteLinkResponse,
  LinkResponse,
  ManyLinksResponse,
} from 'libs/project-id/data-access/api/src/lib/links/links.response'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  private http = inject(HttpClient)

  addLink(link: PanelLinkModel): Observable<PanelLinkModel> {
    return this.http
      .post<LinkResponse>(`/api/projects/${link.projectId}/link`, {
        ...link,
      })
      .pipe(map((res: LinkResponse) => res.link))
  }

  getLinksByProjectId(projectId: string): Observable<PanelLinkModel[]> {
    return this.http.get<ManyLinksResponse>(`/api/projects/${projectId}/links`).pipe(
      /*      catchError((err) => {
              console.log(err)
              return EMPTY
            }),*/
      map((res: ManyLinksResponse) => res.links),
    )
  }

  deleteLink(linkId: string, projectId: string) {
    return this.http
      .delete<DeleteLinkResponse>(`/api/projects/${projectId}/panel/${linkId}`)
      .pipe(map((res: DeleteLinkResponse) => res.linkId))
  }
}
