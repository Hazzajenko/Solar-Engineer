import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../../../environments/environment'
import { map } from 'rxjs/operators'
import { Update } from '@ngrx/entity'
import { TrackerModel } from '../../../../models/deprecated-for-now/tracker.model'

interface GetTrackersResponse {
  trackers: TrackerModel[]
}

interface UpdateTrackerResponse {
  tracker: TrackerModel
}

interface CreateTrackerResponse {
  tracker: TrackerModel
}

interface DeleteTrackerResponse {
  tracker_id: number
}

@Injectable()
export class TrackersDataService extends DefaultDataService<TrackerModel> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Tracker', http, httpUrlGenerator)
  }

  override getAll(): Observable<TrackerModel[]> {
    return this.http
      .get<GetTrackersResponse>(environment.apiUrl + `/projects/3/trackers`)
      .pipe(map((res) => res.trackers))
  }

  override add(entity: TrackerModel): Observable<TrackerModel> {
    return this.http
      .post<CreateTrackerResponse>(environment.apiUrl + `/projects/3/tracker`, entity)
      .pipe(map((res) => res.tracker))
  }

  override update(update: Update<TrackerModel>): Observable<TrackerModel> {
    console.log(update)
    return this.http
      .put<UpdateTrackerResponse>(environment.apiUrl + `/projects/3/tracker/${update.id}`, update)
      .pipe(map((res) => res.tracker))
  }

  override delete(key: number | string): Observable<number | string> {
    return this.http
      .delete<DeleteTrackerResponse>(environment.apiUrl + `/projects/3/tracker/${key}`)
      .pipe(map((res) => res.tracker_id))
  }
}
