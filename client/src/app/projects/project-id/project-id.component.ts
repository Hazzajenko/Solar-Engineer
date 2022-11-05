import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { combineLatest, map, Observable } from 'rxjs';
import { InverterModel } from '../projects-models/inverter.model';
import { selectInvertersByProjectIdRouteParams } from '../projects-store/inverters/inverters.selectors';
import { selectProjectByRouteParams } from '../projects-store/projects/projects.selectors';
import { ProjectModel } from '../projects-models/project.model';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

enum type {
  INVERTER,
  TRACKER,
  STRING,
  PANEL,
}

interface InverterNode {
  name: string;
  type: type;
  children?: InverterNode[];
}

/*interface InverterNode {
  name: string;
  trackers?: TrackerNode[];
}*/

interface TrackerNode {
  name: string;
  strings?: StringNode[];
}

interface StringNode {
  name: string;
  panels?: PanelNode;
}

interface PanelNode {
  name: string;
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
      },
      {
        name: 'Orange',
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
      },
    ],
  },
];

const PROJECT_DATA: InverterNode[] = [
  {
    name: 'Fruit',
    type: type.INVERTER,
    children: [
      { name: 'Apple', type: type.TRACKER },
      { name: 'Banana', type: type.TRACKER },
      {
        name: 'Fruit loops',
        type: type.TRACKER,
      },
    ],
  },
  {
    name: 'Vegetables',
    type: type.INVERTER,
    children: [
      {
        name: 'Green',
        type: type.TRACKER,
        children: [
          { name: 'Broccoli', type: type.STRING },
          { name: 'Brussels sprouts', type: type.STRING },
        ],
      },
      {
        name: 'Orange',
        type: type.TRACKER,
        children: [
          { name: 'Pumpkins', type: type.STRING },
          { name: 'Carrots', type: type.STRING },
        ],
      },
    ],
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-project-id',
  templateUrl: './project-id.component.html',
  styleUrls: ['./project-id.component.scss'],
})
export class ProjectIdComponent implements OnInit {
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );
  store$?: Observable<{
    project?: ProjectModel;
    inverters?: InverterModel[];
  }>;

  constructor(private store: Store<AppState>) {
    this.dataSource.data = PROJECT_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {
    this.store$ = combineLatest([
      this.store.select(selectProjectByRouteParams),
      this.store.select(selectInvertersByProjectIdRouteParams),
    ]).pipe(
      map(([project, inverters]) => ({
        project,
        inverters,
      }))
    );
    this.store
      .select(selectProjectByRouteParams)
      .subscribe((res) => console.log(res));
    this.store
      .select(selectInvertersByProjectIdRouteParams)
      .subscribe((res) => console.log(res));
  }

  onRouteToInverter(inverter: InverterModel) {}

  private _transformer = (node: InverterNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: node.type,
    };
  };

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );
  // @ts-ignore
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
}
