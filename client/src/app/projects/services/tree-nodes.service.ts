import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { selectInvertersByProjectId } from '../projects-store/inverters/inverters.selectors';
import { combineLatest } from 'rxjs';
import { selectTrackersByProjectId } from '../projects-store/trackers/trackers.selectors';
import { selectStringsByProjectId } from '../projects-store/strings/strings.selectors';
import { addTreeNode } from '../projects-store/tree-node/tree-node.actions';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';

export enum type {
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

/** Flat node with expandable and level information */
export interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Injectable({
  providedIn: 'root',
})
export class TreeNodesService {
  constructor(private http: HttpClient, private store: Store<AppState>) {}

  initTreeNode(projectId: number) {
    combineLatest([
      this.store.select(
        selectInvertersByProjectId({
          projectId,
        })
      ),
      this.store.select(
        selectTrackersByProjectId({
          projectId,
        })
      ),
      this.store.select(
        selectStringsByProjectId({
          projectId,
        })
      ),
    ]).subscribe(([inverters, trackers, strings]) => {
      console.log('inverters', inverters);
      console.log('trackers', trackers);
      console.log('strings', strings);

      inverters.map((inverter) => {
        const inverterNode: ProjectNode = {
          id: inverter.id,
          projectId: inverter.projectId,
          name: inverter.name,
          type: type.INVERTER,
          children: [],
        };
        const inverterTrackers = trackers.filter(
          (tracker) => tracker.inverterId === inverter.id
        );
        inverterTrackers.map((inverterTracker) => {
          const trackerNode: ProjectNode = {
            id: inverterTracker.id,
            projectId: inverterTracker.projectId,
            name: inverterTracker.name,
            type: type.TRACKER,
            children: [],
          };
          const trackerStrings = strings.filter(
            (stringModel) => stringModel.trackerId === inverterTracker.id
          );

          trackerStrings.map((trackerString) => {
            const stringNode: ProjectNode = {
              id: trackerString.id,
              projectId: trackerString.projectId,
              name: trackerString.name,
              type: type.STRING,
              children: [],
            };
            trackerNode.children?.push(stringNode);
          });
          inverterNode.children?.push(trackerNode);
        });
        this.store.dispatch(addTreeNode({ treeNode: inverterNode }));
      });
    });
  }

  private _transformer = (node: ProjectNode, level: type) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  // @ts-ignore
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
}
