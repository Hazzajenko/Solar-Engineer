import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Update } from '@ngrx/entity'
// import { PanelLinkModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/panel-link.model'
import { PanelLinkModel } from '@shared/data-access/models'

interface GetPanelLinksResponse {
  panelLinks: PanelLinkModel[]
}

interface UpdatePanelLinkResponse {
  panelLink: PanelLinkModel
}

interface CreatePanelLinkResponse {
  panelLink: PanelLinkModel
}

interface DeletePanelLinkResponse {
  panelLinkId: number
}

@Injectable()
export class PanelLinksDataService extends DefaultDataService<PanelLinkModel> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('PanelLink', http, httpUrlGenerator)
  }

  override getAll(): Observable<PanelLinkModel[]> {
    return this.http
      .get<GetPanelLinksResponse>(`/api/projects/1/panelLinks`)
      .pipe(map((res) => res.panelLinks))
  }

  override add(entity: PanelLinkModel): Observable<PanelLinkModel> {
    return this.http
      .post<CreatePanelLinkResponse>(`/api/projects/1/panelLink`, entity)
      .pipe(map((res) => res.panelLink))
  }

  override update(update: Update<PanelLinkModel>): Observable<PanelLinkModel> {
    console.log(update)
    return this.http
      .put<UpdatePanelLinkResponse>(`/api/projects/1/panelLink/${update.id}`, update)
      .pipe(map((res) => res.panelLink))
  }

  override delete(key: number | string): Observable<number | string> {
    return this.http
      .delete<DeletePanelLinkResponse>(`/api/projects/1/panelLink/${key}`)
      .pipe(map((res) => res.panelLinkId))
  }
}
