import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data'
import { PanelModel } from '../../../../models/panel.model'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../../../environments/environment'
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
  panel_id: number
}

@Injectable()
export class PanelsDataService extends DefaultDataService<PanelModel> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Panel', http, httpUrlGenerator)
  }

  override getAll(): Observable<PanelModel[]> {
    return this.http
      .get<GetPanelsResponse>(environment.apiUrl + `/projects/3/panels`)
      .pipe(map((res) => res.panels))
  }

  override add(entity: PanelModel): Observable<PanelModel> {
    return this.http
      .post<CreatePanelResponse>(
        environment.apiUrl + `/projects/3/panel`,
        entity,
      )
      .pipe(map((res) => res.panel))
  }

  override update(update: Update<PanelModel>): Observable<PanelModel> {
    // update.
    // const id = Number(update.id
    console.log(update)
    return this.http
      .put<UpdatePanelResponse>(
        environment.apiUrl + `/projects/3/panel/${update.id}`,
        update,
      )
      .pipe(map((res) => res.panel))
    // return super.update(update)
  }

  override delete(key: number | string): Observable<number | string> {
    return this.http
      .delete<DeletePanelResponse>(
        environment.apiUrl + `/projects/3/panel/${key}`,
      )
      .pipe(map((res) => res.panel_id))
  }
}
