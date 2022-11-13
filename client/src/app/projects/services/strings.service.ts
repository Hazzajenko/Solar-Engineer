import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { StringModel } from '../models/string.model'
import { addString, updateString } from '../store/strings/strings.actions'
import { TrackerModel } from '../models/tracker.model'
import { PanelModel } from '../models/panel.model'
import { Update } from '@ngrx/entity'
import { updateManyPanels } from '../store/panels/panels.actions'

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

  /*  getTrackersByProjectId(projectId: number): Promise<TrackersEnvelope> {
      return new Promise<TrackersEnvelope>((resolve, reject) =>
        this.http
          .get<TrackersEnvelope>(
            environment.apiUrl + `/projects/${projectId}/trackers`
          )
          .subscribe({
            next: (envelope) => {
              this.store.dispatch(addTrackers({ trackers: envelope.trackers }));
              resolve(envelope);
            },
            error: (err) => {
              reject(err);
            },
            complete: () => {
              console.log('getTrackersByProjectId');
            },
          })
      );
    }*/

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
            // this.store.dispatch(updateTracker({ tracker: envelope.tracker }));
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
                          this.store.dispatch(updatePanel({ panel }))
                        })*/
            const panels = envelope.panels.map((panel) => {
              return {
                id: panel.id,
                changes: panel,
              } as Update<PanelModel>
            })
            this.store.dispatch(updateManyPanels({ panels }))
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
          is_in_parallel: string.is_in_parallel,
          inverter_id: string.inverter_id,
          tracker_id: string.tracker_id,
          id: string.id,
          version: string.version,
          panel_amount: string.panel_amount,
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
}
