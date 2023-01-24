import { Update } from '@ngrx/entity'
import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { PanelModel } from '@shared/data-access/models'
import { EMPTY, Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import {
  DeleteManyPanelsResponse,
  DeletePanelResponse,
  ManyPanelsResponse,
  PanelResponse,
  UpdateManyPanelsResponse,
} from './panels.response'

@Injectable({
  providedIn: 'root',
})
export class PanelsService {
  private http = inject(HttpClient)

  addPanel(panel: PanelModel): Observable<PanelModel> {
    return this.http.post<PanelResponse>(`/api/projects/${panel.projectId}/panel`, {
      ...panel,
    }).pipe(
      map((res: PanelResponse) => res.panel),
    )
  }

  addManyPanels(panels: PanelModel[], projectId: number): Observable<PanelModel[]> {
    return this.http.post<ManyPanelsResponse>(`/api/projects/${projectId}/panels`, {
      panels,
    }).pipe(
      map((res: ManyPanelsResponse) => res.panels),
    )
  }

  getPanelsByProjectId(projectId: number): Observable<PanelModel[]> {
    return this.http.get<ManyPanelsResponse>(`/api/projects/${projectId}/panels`).pipe(
      /*      catchError((err) => {
              console.log(err)
              return EMPTY
            }),*/
      map((res: ManyPanelsResponse) => res.panels),
    )
  }

  updatePanel(update: Update<PanelModel>, projectId: number) {
    return this.http.put<PanelResponse>(`/api/projects/${projectId}/panel/${update.id}`, {
      ...update,
    }).pipe(
      map((res: PanelResponse) => res.panel),
    )
  }

  updateManyPanels(updates: Update<PanelModel>[], projectId: number) {
    return this.http.put<UpdateManyPanelsResponse>(`/api/projects/${projectId}/panels`, {
      updates,
    }).pipe(
      map((res: UpdateManyPanelsResponse) => res),
    )
  }

  deletePanel(panelId: string, projectId: number) {
    return this.http.delete<DeletePanelResponse>(`/api/projects/${projectId}/panel/${panelId}`).pipe(
      map((res: DeletePanelResponse) => res.panelId),
    )
  }

  deleteManyPanels(panelIds: string[], projectId: number) {
    return this.http.delete<DeleteManyPanelsResponse>(`/api/projects/${projectId}/panels`).pipe(
      map((res: DeleteManyPanelsResponse) => res),
    )
  }
}
