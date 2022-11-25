import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Update } from '@ngrx/entity'
import { PanelJoinModel } from '../../../models/panel-join.model'

interface GetPanelJoinsResponse {
  panel_joins: PanelJoinModel[]
}

interface UpdatePanelJoinResponse {
  panel_join: PanelJoinModel
}

interface CreatePanelJoinResponse {
  panel_join: PanelJoinModel
}

interface DeletePanelJoinResponse {
  panel_join_id: number
}

@Injectable()
export class PanelJoinsDataService extends DefaultDataService<PanelJoinModel> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('PanelJoin', http, httpUrlGenerator)
  }

  override getAll(): Observable<PanelJoinModel[]> {
    return this.http
      .get<GetPanelJoinsResponse>(`/api/projects/3/panel-joins`)
      .pipe(map((res) => res.panel_joins))
  }

  override add(entity: PanelJoinModel): Observable<PanelJoinModel> {
    return this.http
      .post<CreatePanelJoinResponse>(`/api/projects/3/panel-join`, entity)
      .pipe(map((res) => res.panel_join))
  }

  override update(update: Update<PanelJoinModel>): Observable<PanelJoinModel> {
    console.log(update)
    return this.http
      .put<UpdatePanelJoinResponse>(
        `/api/projects/3/panel-join/${update.id}`,
        update,
      )
      .pipe(map((res) => res.panel_join))
  }

  override delete(key: number | string): Observable<number | string> {
    return this.http
      .delete<DeletePanelJoinResponse>(`/api/projects/3/panel-join/${key}`)
      .pipe(map((res) => res.panel_join_id))
  }
}
