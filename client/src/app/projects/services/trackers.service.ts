import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { TrackerModel } from '../models/tracker.model'
import { addTrackers, deleteTracker } from '../store/trackers/trackers.actions'

interface TrackersEnvelope {
  trackers: TrackerModel[]
}

interface TrackerEnvelope {
  tracker: TrackerModel
}

@Injectable({
  providedIn: 'root',
})
export class TrackersService {
  constructor(private http: HttpClient, private store: Store<AppState>) {}

  getTrackersByProjectId(projectId: number): Promise<TrackersEnvelope> {
    return new Promise<TrackersEnvelope>((resolve, reject) =>
      this.http
        .get<TrackersEnvelope>(
          environment.apiUrl + `/projects/${projectId}/trackers`,
        )
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(addTrackers({ trackers: envelope.trackers }))
            resolve(envelope)
          },
          error: (err) => {
            reject(err)
          },
          complete: () => {
            console.log('getTrackersByProjectId')
          },
        }),
    )
  }

  createTrackers(
    projectId: number,
    inverterId: number,
  ): Promise<TrackersEnvelope> {
    // const token = localStorage.getItem('token');
    /*    console.log(token);
        this.store.select(selectToken).subscribe((token) => {
          console.log('hello');
          console.log(token);
          if (token) {
            console.log(token);
          }
        });*/
    return new Promise<TrackersEnvelope>((resolve, reject) =>
      this.http
        .post<TrackersEnvelope>(
          environment.apiUrl + `/projects/${projectId}/${inverterId}`,
          {},
        )
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(addTrackers({ trackers: envelope.trackers }))
            resolve(envelope)
          },
          error: (err) => {
            reject(err)
          },
          complete: () => {
            console.log('createTrackers')
          },
        }),
    )
  }

  deleteTracker(
    projectId: number,
    trackerId: number,
  ): Promise<TrackerEnvelope> {
    return new Promise<TrackerEnvelope>((resolve, reject) =>
      this.http
        .delete<TrackerEnvelope>(
          `${environment.apiUrl}/projects/${projectId}/trackers`,
          {
            body: {
              id: trackerId,
            },
          },
        )
        .subscribe({
          next: (envelope) => {
            this.store.dispatch(deleteTracker({ trackerId }))
            resolve(envelope)
          },
          error: (err) => {
            reject(err)
          },
          complete: () => {
            console.log('deleteTracker')
          },
        }),
    )
  }
}
