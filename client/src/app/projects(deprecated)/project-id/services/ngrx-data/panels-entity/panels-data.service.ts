import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data'
import { PanelModel } from '../../../../models/panel.model'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Update } from '@ngrx/entity'

interface GetPanelsResponse {
  panels: PanelModel[]
}

interface UpdatePanelResponse {
  panel: PanelModel
}

interface CreatePanelResponse {
  panel: PanelModel
}

interface DeletePanelResponse {
  panelId: number
}

@Injectable()
export class PanelsDataService extends DefaultDataService<PanelModel> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Panel', http, httpUrlGenerator)
  }

  override getAll(): Observable<PanelModel[]> {
    return (
      this.http
        .get<GetPanelsResponse>(`/api/projects/1/panels`)
        // .get<GetPanelsResponse>(environment.apiUrl + `/projects(deprecated)/3/panels`)
        .pipe(map((res) => res.panels))
    )
  }

  override add(entity: PanelModel): Observable<PanelModel> {
    return this.http
      .post<CreatePanelResponse>(`/api/projects/1/panel`, entity)
      .pipe(map((res) => res.panel))
  }

  override update(update: Update<PanelModel>): Observable<PanelModel> {
    return this.http
      .put<UpdatePanelResponse>(`/api/projects/1/panel/${update.id}`, {
        ...update.changes,
      })
      .pipe(
        map((res) => {
          return res.panel
        }),
      )
  }

  override delete(key: number | string): Observable<number | string> {
    return this.http
      .delete<DeletePanelResponse>(`/api/projects/1/panel/${key}`)
      .pipe(map((res) => res.panelId))
  }
}
