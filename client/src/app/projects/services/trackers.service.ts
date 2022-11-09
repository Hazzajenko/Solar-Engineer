import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { InverterModel } from '../models/inverter.model';
import { addTreeNode } from '../store/tree-node/tree-node.actions';
import { type } from './tree-nodes.service';
import { TrackerModel } from '../models/tracker.model';
import { addTrackers } from '../store/trackers/trackers.actions';

interface TrackersEnvelope {
  trackers: TrackerModel[];
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
  }

  createTrackers(
    projectId: number,
    inverterId: number
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
          {}
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
            console.log('createTrackers');
          },
        })
    );
  }

  breakDownInvertersForTreeNode(inverters: InverterModel[]) {
    inverters.map((inverter) => {
      this.store.dispatch(
        addTreeNode({
          treeNode: {
            id: inverter.id,
            projectId: inverter.projectId,
            name: inverter.name,
            type: type.INVERTER,
            children: [],
          },
        })
      );
    });
  }
}
