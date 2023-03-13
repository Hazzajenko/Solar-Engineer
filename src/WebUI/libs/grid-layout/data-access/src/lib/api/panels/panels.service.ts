import { Update } from '@ngrx/entity'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { PanelModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import {
  DeleteManyPanelsResponse,
  DeletePanelResponse,
  ManyPanelsResponse,
  PanelResponse,
  UpdateManyPanelsResponse,
} from './panels.response'
import { CreatePanel, ProjectsSignalrService } from '@projects/data-access'
import { CreatePanelRequest } from '../../contracts'
import { BaseService } from '@shared/logger'

@Injectable({
  providedIn: 'root',
})
export class PanelsService extends BaseService {
  private http = inject(HttpClient)
  private projectsSignalrService = inject(ProjectsSignalrService)

  // private logger = inject(LoggerService)

  /*  constructor(logger: LoggerService) {
      super(logger)
    }*/

  addPanelSignalr(request: CreatePanelRequest) {
    if (!this.projectsSignalrService.projectsHubConnection) return
    this.projectsSignalrService.projectsHubConnection
      .invoke(CreatePanel, request)
      .catch((e) => this.logError('addPanelSignalr', e))
    // .catch((e) => this.logger.error({ source: 'PanelsSignalrService', objects: [e] }))
  }

  addPanel(panel: PanelModel): Observable<PanelModel> {
    return this.http
      .post<PanelResponse>(`/api/projects/${panel.projectId}/panel`, {
        ...panel,
      })
      .pipe(map((res: PanelResponse) => res.panel))
  }

  addManyPanels(panels: PanelModel[], projectId: string): Observable<PanelModel[]> {
    return this.http
      .post<ManyPanelsResponse>(`/api/projects/${projectId}/panels`, {
        panels,
      })
      .pipe(map((res: ManyPanelsResponse) => res.panels))
  }

  getPanelsByProjectId(projectId: string): Observable<PanelModel[]> {
    return this.http.get<ManyPanelsResponse>(`/api/projects/${projectId}/panels`).pipe(
      /*      catchError((err) => {
              console.log(err)
              return EMPTY
            }),*/
      map((res: ManyPanelsResponse) => res.panels),
    )
  }

  updatePanel(update: Update<PanelModel>, projectId: string) {
    return this.http
      .put<PanelResponse>(`/api/projects/${projectId}/panel/${update.id}`, {
        ...update,
      })
      .pipe(map((res: PanelResponse) => res.panel))
  }

  updateManyPanels(updates: Update<PanelModel>[], projectId: string) {
    return this.http
      .put<UpdateManyPanelsResponse>(`/api/projects/${projectId}/panels`, {
        updates,
      })
      .pipe(map((res: UpdateManyPanelsResponse) => res))
  }

  deletePanel(panelId: string, projectId: string) {
    return this.http
      .delete<DeletePanelResponse>(`/api/projects/${projectId}/panel/${panelId}`)
      .pipe(map((res: DeletePanelResponse) => res.panelId))
  }

  deleteManyPanels(panelIds: string[], projectId: string) {
    return this.http
      .delete<DeleteManyPanelsResponse>(`/api/projects/${projectId}/panels`)
      .pipe(map((res: DeleteManyPanelsResponse) => res))
  }
}
