import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { PanelModel } from '../models/panel.model';
import { addPanel } from '../store/panels/panels.actions';

interface PanelsEnvelope {
  panels: PanelModel[];
}

interface PanelEnvelope {
  panel: PanelModel;
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
    stringId: number
  ): Promise<PanelEnvelope> {
    return new Promise<PanelEnvelope>((resolve, reject) =>
      this.http
        .post<PanelEnvelope>(
          environment.apiUrl +
            `/projects/${projectId}/${inverterId}/${trackerId}/${stringId}`,
          {}
        )
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(addPanel({ panel: envelope.panel }));
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
}
