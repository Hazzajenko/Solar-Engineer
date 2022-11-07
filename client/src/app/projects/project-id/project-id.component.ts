import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { combineLatest, Observable } from 'rxjs';
import { InverterModel } from '../models/inverter.model';
import {
  FlatNode,
  ProjectNode,
  TreeNodesService,
} from '../services/tree-nodes.service';
import { selectAllTreeNodes } from '../store/tree-node/tree-node.selectors';
import { SelectionModel } from '@angular/cdk/collections';
import { MatMenuTrigger } from '@angular/material/menu';
import { selectInvertersByProjectId } from '../store/inverters/inverters.selectors';
import { selectTrackersByProjectId } from '../store/trackers/trackers.selectors';
import { selectStringsByProjectId } from '../store/strings/strings.selectors';
import { selectPanelsByProjectId } from '../store/panels/panels.selectors';
import { map } from 'rxjs/operators';
import { TrackerModel } from '../models/tracker.model';
import { StringModel } from '../models/string.model';
import { PanelModel } from '../models/panel.model';

@Component({
  selector: 'app-project-id',
  templateUrl: './project-id.component.html',
  styleUrls: ['./project-id.component.scss'],
})
export class ProjectIdComponent implements OnInit {
  // we create an object that contains coordinates
  menuTopLeftPosition = { x: '0', y: '0' };
  inverterBool: boolean[] = [false, false, false];
  trackerBool: boolean[] = [false, false, false];
  stringBool: boolean[] = [false, false, false];

  // reference to the MatMenuTrigger in the DOM
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger!: MatMenuTrigger;
  treeControl = this.treeNodes.treeControl;
  treeFlattener = this.treeNodes.treeFlattener;
  dataSource = this.treeNodes.dataSource;
  /** The selection for checklist */
  checklistSelection = new SelectionModel<FlatNode>(false /* multiple */);
  store$?: Observable<{
    // project?: ProjectModel;
    inverters?: InverterModel[];
    trackers?: TrackerModel[];
    strings?: StringModel[];
    panels?: PanelModel[];
  }>;

  constructor(
    private store: Store<AppState>,
    private treeNodes: TreeNodesService
  ) {
    // this.dataSource.data = PROJECT_DATA;
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  ngOnInit(): void {
    this.store$ = combineLatest([
      this.store.select(
        selectInvertersByProjectId({
          projectId: 3,
        })
      ),
      this.store.select(
        selectTrackersByProjectId({
          projectId: 3,
        })
      ),
      this.store.select(
        selectStringsByProjectId({
          projectId: 3,
        })
      ),
      this.store.select(
        selectPanelsByProjectId({
          projectId: 3,
        })
      ),
    ]).pipe(
      map(([inverters, trackers, strings, panels]) => ({
        inverters,
        trackers,
        strings,
        panels,
      }))
    );

    this.store.select(selectAllTreeNodes).subscribe((treeNodes) => {
      this.dataSource.data = treeNodes;
    });
  }

  onRightClick(event: MouseEvent, item: ProjectNode) {
    // preventDefault avoids to show the visualization of the right-click menu of the browser
    event.preventDefault();

    // we record the mouse position in our object
    this.menuTopLeftPosition.x = event.clientX + 'px';
    console.log(this.menuTopLeftPosition.x);
    this.menuTopLeftPosition.y = event.clientY + 'px';
    console.log(this.menuTopLeftPosition.y);
    // we open the menu
    // we pass to the menu the information about our object
    this.matMenuTrigger.menuData = { item: item };

    // we open the menu
    this.matMenuTrigger.openMenu();
  }

  todoLeafItemSelectionToggle(node: FlatNode): void {
    // this.checklistSelection.toggle(node);
    this.checklistSelection.setSelection(node);
    console.log(this.checklistSelection.selected);
    console.log('toggle: ', node);
    this.checkAllParentsSelection(node);
  }

  getLevel = (node: FlatNode) => node.level;
  hasNoContent = (_: number, _nodeData: FlatNode) => _nodeData.name === '';

  checkAllParentsSelection(node: FlatNode): void {
    let parent: FlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: FlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: FlatNode): FlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  insertItem(parent: ProjectNode, name: string) {
    if (parent.children) {
      parent.children.push({ item: name } as unknown as ProjectNode);
      /*      this.dataChange.next(this.data);
            this.dataSource.data.push();*/
    }
  }

  updateItem(node: ProjectNode, name: string) {
    node.name = name;
    // this.dataChange.next(this.data);
  }

  descendantsAllSelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach((child) => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  onRouteToInverter(inverter: InverterModel) {}

  /** Select the category so we can insert the new item. */
  /*  addNewItem(node: FlatNode) {
      const parentNode = this.flatNodeMap.get(node);
      this._database.insertItem(parentNode!, '');
      this.treeControl.expand(node);
    }

    /!** Save the node to database *!/
    saveNode(node: FlatNode, itemValue: string) {
      const nestedNode = this.flatNodeMap.get(node);
      this._database.updateItem(nestedNode!, itemValue);
    }*/

  /*  private _transformer = (node: InverterNode, level: number) => {
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
    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);*/
  click() {
    console.log('click');
  }

  toggleInverter(inverter: InverterModel, index: number) {
    this.inverterBool[index] = !this.inverterBool[index];
    console.log(this.inverterBool[index]);
  }

  toggleTracker(tracker: TrackerModel, index: number) {
    this.trackerBool[index] = !this.trackerBool[index];
    console.log(this.trackerBool[index]);
  }

  toggleString(stringModel: StringModel, index: number) {
    this.stringBool[index] = !this.stringBool[index];
    console.log(this.stringBool[index]);
  }
}
