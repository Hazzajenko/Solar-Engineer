import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { PanelModel } from '../models/panel.model';
import { addPanel, updatePanel } from '../store/panels/panels.actions';
import { StringModel } from '../models/string.model';

interface PanelsEnvelope {
  panels: PanelModel[];
}

interface PanelEnvelope {
  panel: PanelModel;
}

interface CreatePanelResponse {
  panel: PanelModel;
  string: StringModel;
}

@Injectable({
  providedIn: 'root',
})
export class PanelsService {
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

  createPanel(
    projectId: number,
    inverterId: number,
    trackerId: number,
    string: StringModel
  ): Promise<CreatePanelResponse> {
    return new Promise<CreatePanelResponse>((resolve, reject) =>
      this.http
        .post<CreatePanelResponse>(
          environment.apiUrl +
            `/projects/${projectId}/${inverterId}/${trackerId}/${string.id}`,
          {
            // string,
          }
        )
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(addPanel({ panel: envelope.panel }));
            // this.store.dispatch(updateString({ string: envelope.string }));
            resolve(envelope);
          },
          error: (err) => {
            reject(err);
          },
          complete: () => {
            console.log('createPanel');
          },
        })
    );
  }

  updatePanel(projectId: number, panel: PanelModel): Promise<PanelEnvelope> {
    return new Promise<PanelEnvelope>((resolve, reject) =>
      this.http
        .post<PanelEnvelope>(
          environment.apiUrl + `/projects/${projectId}/panels`,
          {
            id: panel.id,
            inverterId: panel.inverterId,
            trackerId: panel.trackerId,
            stringId: panel.stringId,
            location: panel.location,
            version: panel.version,
          }
        )
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(updatePanel({ panel: envelope.panel }));
            resolve(envelope);
          },
          error: (err) => {
            reject(err);
          },
          complete: () => {
            console.log('updatePanel');
          },
        })
    );
  }
}
