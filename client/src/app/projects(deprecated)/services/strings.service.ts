import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { StringModel } from '../models/string.model'
import { addString, deleteString, updateString } from '../store(deprecated)/strings/strings.actions'
import { TrackerModel } from '../models/deprecated-for-now/tracker.model'
import { PanelModel } from '../models/panel.model'
import { Update } from '@ngrx/entity'
import { PanelStateActions } from '../project-id/services/store/panels/panels.actions'

interface StringsEnvelope {
  strings: StringModel[]
}

interface StringEnvelope {
  string: StringModel
}

interface ChangeStringColorResponse {
  string: StringModel
  panelsChanged: number
  panels: PanelModel[]
}

interface CreateStringResponse {
  string: StringModel
  tracker: TrackerModel
}

@Injectable({
  providedIn: 'root',
})
export class StringsService {
  constructor(private http: HttpClient, private store: Store<AppState>) {}

  createString(
    project_id: number,
    inverter_id: number,
    tracker_id: number,
    name: string,
  ): Promise<CreateStringResponse> {
    return new Promise<CreateStringResponse>((resolve, reject) =>
      this.http
        .post<CreateStringResponse>(environment.apiUrl + `/projects/${project_id}/trackers`, {
          inverter_id,
          tracker_id,
          name,
          isInParallel: false,
          // tracker,
        })
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(addString({ stringModel: envelope.string }))
            // this.store(deprecated).dispatch(updateTracker({ tracker: envelope.tracker }));
            resolve(envelope)
          },
          error: (err) => {
            reject(err)
          },
          complete: () => {
            console.log('createString')
          },
        }),
    )
  }

  updateStringColor(
    projectId: number,
    string: StringModel,
    color: string,
  ): Promise<ChangeStringColorResponse> {
    return new Promise<ChangeStringColorResponse>((resolve, reject) =>
      this.http
        .post<ChangeStringColorResponse>(
          environment.apiUrl + `/projects/${projectId}/strings/color`,
          {
            id: string.id,
            color,
          },
        )
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(updateString({ string: envelope.string }))
            /*            envelope.panels.forEach((panel) => {
                          this.store(deprecated).dispatch(updatePanel({ panel }))
                        })*/
            const panels = envelope.panels.map((panel) => {
              return {
                id: panel.id,
                changes: panel,
              } as Update<PanelModel>
            })
            this.store.dispatch(PanelStateActions.updateManyPanels({ panels }))
            resolve(envelope)
          },
          error: (err) => {
            reject(err)
          },
          complete: () => {
            console.log('updateStringColor')
          },
        }),
    )
  }

  updateString(projectId: number, string: StringModel): Promise<StringEnvelope> {
    return new Promise<StringEnvelope>((resolve, reject) =>
      this.http
        .post<StringEnvelope>(environment.apiUrl + `/projects/${projectId}/strings`, {
          name: string.name,
          is_in_parallel: string.isInParallel,
          inverter_id: string.inverterId,
          tracker_id: string.trackerId,
          id: string.id,
          version: string.version,
          panel_amount: string.panelAmount,
        })
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(updateString({ string: envelope.string }))
            resolve(envelope)
          },
          error: (err) => {
            reject(err)
          },
          complete: () => {
            console.log('updateString')
          },
        }),
    )
  }

  deleteString(projectId: number, stringId: number): Promise<StringEnvelope> {
    return new Promise<StringEnvelope>((resolve, reject) =>
      this.http
        .delete<StringEnvelope>(`${environment.apiUrl}/projects/${projectId}/strings`, {
          body: {
            id: stringId,
          },
        })
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(deleteString({ stringId }))
            resolve(envelope)
          },
          error: (err) => {
            reject(err)
          },
          complete: () => {
            console.log('deleteString')
          },
        }),
    )
  }
}
