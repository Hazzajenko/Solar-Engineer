import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { PanelModel } from '../models/panel.model'
import { StringModel } from '../models/string.model'
import {
  CreatePanelRequest,
  PanelStateActions,
  UpdatePanelRequest,
} from '../store/panels/panels.actions'
import { BlocksStateActions } from '../store/blocks/blocks.actions'
import { UnitModel } from '../models/unit.model'

interface PanelsEnvelope {
  panels: PanelModel[]
}

interface PanelEnvelope {
  panel: PanelModel
}

interface CreatePanelResponse {
  panel: PanelModel
  string: StringModel
}

@Injectable({
  providedIn: 'root',
})
export class PanelsService {
  constructor(private http: HttpClient, private store: Store<AppState>) {}

  createPanel(
    projectId: number,
    inverterId: number,
    trackerId: number,
    stringId: number,
  ): Promise<CreatePanelResponse> {
    return new Promise<CreatePanelResponse>((resolve, reject) =>
      this.http
        .post<CreatePanelResponse>(
          environment.apiUrl +
            `/projects/${projectId}/${inverterId}/${trackerId}/${stringId}`,
          {
            inverterId,
            trackerId,
            stringId,
          },
        )
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(
              PanelStateActions.addPanelToState({ panel: envelope.panel }),
            )
            resolve(envelope)
          },
          error: (err) => {
            reject(err)
          },
          complete: () => {
            console.log('createPanel')
          },
        }),
    )
  }

  createPanelForGrid(
    projectId: number,
    inverter_id: number,
    tracker_id: number,
    string_id: number,
    location: string,
    color: string,
  ): Promise<CreatePanelResponse> {
    return new Promise<CreatePanelResponse>((resolve, reject) =>
      this.http
        .post<CreatePanelResponse>(
          `${environment.apiUrl}/projects/${projectId}/panels`,
          {
            inverter_id,
            tracker_id,
            string_id,
            location,
          },
        )
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(
              PanelStateActions.addPanelToState({ panel: envelope.panel }),
            )
            resolve(envelope)
          },
          error: (err) => {
            reject(err)
          },
          complete: () => {
            console.log('createPanel')
          },
        }),
    )
  }

  addPanel(request: CreatePanelRequest) {
    return this.http.post<CreatePanelResponse>(
      `${environment.apiUrl}/projects/${request.project_id}/panels`,
      {
        inverter_id: request.inverter_id,
        tracker_id: request.tracker_id,
        string_id: request.string_id,
        location: request.location,
      },
    )
  }

  updatePanel(request: UpdatePanelRequest) {
    // console.log('update', request)
    return this.http.patch<PanelEnvelope>(
      `${environment.apiUrl}/projects/${request.project_id}/panels`,
      {
        id: request.panel.id,
        inverter_id: request.panel.inverter_id,
        tracker_id: request.panel.tracker_id,
        string_id: request.panel.string_id,
        location: request.newLocation,
      },
    )
  }

  updatePanelOld(
    projectId: number,
    panel: PanelModel,
    newLocation: string,
  ): Promise<PanelEnvelope> {
    return new Promise<PanelEnvelope>((resolve, reject) =>
      this.http
        .patch<PanelEnvelope>(
          `${environment.apiUrl}/projects/${projectId}/panels`,
          {
            id: panel.id,
            inverter_id: panel.inverter_id,
            tracker_id: panel.tracker_id,
            string_id: panel.string_id,
            location: newLocation,
            version: panel.version,
          },
        )
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(
              PanelStateActions.updatePanelToState({ panel: envelope.panel }),
            )
            this.store.dispatch(
              BlocksStateActions.updateBlockForGrid({
                // oldLocation: panel.location,
                block: {
                  id: envelope.panel.id,
                  location: envelope.panel.location,
                  project_id: projectId!,
                  model: UnitModel.PANEL,
                },
              }),
            )
            resolve(envelope)
          },
          error: (err) => {
            reject(err)
          },
          complete: () => {
            console.log('updatePanel')
          },
        }),
    )
  }

  deletePanel(projectId: number, panelId: number): Promise<PanelEnvelope> {
    return new Promise<PanelEnvelope>((resolve, reject) =>
      this.http
        .delete<PanelEnvelope>(
          `${environment.apiUrl}/projects/${projectId}/panels`,
          {
            body: {
              id: panelId,
            },
          },
        )
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(
              PanelStateActions.deletePanelToState({ panelId }),
            )
            resolve(envelope)
          },
          error: (err) => {
            reject(err)
          },
          complete: () => {
            console.log('deletePanel')
          },
        }),
    )
  }
}
