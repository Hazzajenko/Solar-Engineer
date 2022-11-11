import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { StringModel } from '../models/string.model';
import { addString, updateString } from '../store/strings/strings.actions';
import { TrackerModel } from '../models/tracker.model';

interface StringsEnvelope {
  strings: StringModel[];
}

interface StringEnvelope {
  string: StringModel;
}

interface CreateStringResponse {
  string: StringModel;
  tracker: TrackerModel;
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
    projectId: number,
    inverterId: number,
    tracker: TrackerModel,
    name: string
  ): Promise<CreateStringResponse> {
    return new Promise<CreateStringResponse>((resolve, reject) =>
      this.http
        .post<CreateStringResponse>(
          environment.apiUrl +
            `/projects/${projectId}/${inverterId}/${tracker.id}`,
          {
            name,
            isInParallel: false,
            // tracker,
          }
        )
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(addString({ stringModel: envelope.string }));
            // this.store.dispatch(updateTracker({ tracker: envelope.tracker }));
            resolve(envelope);
          },
          error: (err) => {
            reject(err);
          },
          complete: () => {
            console.log('createString');
          },
        })
    );
  }

  updateString(
    projectId: number,
    string: StringModel
  ): Promise<StringEnvelope> {
    return new Promise<StringEnvelope>((resolve, reject) =>
      this.http
        .post<StringEnvelope>(
          environment.apiUrl + `/projects/${projectId}/strings`,
          {
            name: string.name,
            isInParallel: string.isInParallel,
            inverterId: string.inverterId,
            trackerId: string.trackerId,
            id: string.id,
            version: string.version,
            panelAmount: string.panelAmount,
          }
        )
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(updateString({ string: envelope.string }));
            resolve(envelope);
          },
          error: (err) => {
            reject(err);
          },
          complete: () => {
            console.log('updateString');
          },
        })
    );
  }
}
