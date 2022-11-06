import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { InverterModel } from '../projects-models/inverter.model';
import { addTreeNode } from '../projects-store/tree-node/tree-node.actions';
import { type } from './tree-nodes.service';
import { TrackerModel } from '../projects-models/tracker.model';
import { addTrackersByProjectId } from '../projects-store/trackers/trackers.actions';

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
            this.store.dispatch(
              addTrackersByProjectId({ trackers: envelope.trackers })
            );
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

  breakDownInvertersForTreeNode(inverters: InverterModel[]) {
    inverters.map((inverter) => {
      this.store.dispatch(
        addTreeNode({
          treeNode: {
            id: inverter.id,
            projectId: inverter.project_id,
            name: inverter.name,
            type: type.INVERTER,
            children: [],
          },
        })
      );
    });
  }
}
