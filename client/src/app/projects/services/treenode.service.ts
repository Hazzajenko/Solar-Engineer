import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { selectInvertersByProjectId } from '../projects-store/inverters/inverters.selectors';
import { addTreeNode } from '../projects-store/tree-node/tree-node.actions';

enum type {
  INVERTER,
  TRACKER,
  STRING,
  PANEL,
}

export interface ProjectNode {
  id: number;
  projectId: number;
  name?: string;
  type?: type;
  children?: ProjectNode[];
}

@Injectable({
  providedIn: 'root',
})
export class TreenodeService {
  constructor(private http: HttpClient, private store: Store<AppState>) {}

  initTreeNode(project_id: number) {
    this.store
      .select(selectInvertersByProjectId({ project_id: `${project_id}` }))
      .subscribe((inverters) => {
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
      });
  }
}
