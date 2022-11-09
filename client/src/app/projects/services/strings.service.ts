import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { StringModel } from '../models/string.model';
import { addString } from '../store/strings/strings.actions';

interface StringsEnvelope {
  strings: StringModel[];
}

interface StringEnvelope {
  string: StringModel;
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
    trackerId: number,
    name: string
  ): Promise<StringEnvelope> {
    return new Promise<StringEnvelope>((resolve, reject) =>
      this.http
        .post<StringEnvelope>(
          environment.apiUrl +
            `/projects/${projectId}/${inverterId}/${trackerId}`,
          {
            name,
            isInParallel: false,
          }
        )
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(addString({ stringModel: envelope.string }));
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
}
