import { Component, OnInit, ViewChild } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { combineLatest, Observable } from 'rxjs'
import { InverterModel } from '../models/inverter.model'
import { MatMenuTrigger } from '@angular/material/menu'
import {
  selectInverterById,
  selectInvertersByProjectId,
} from '../store/inverters/inverters.selectors'
import {
  selectTrackerById,
  selectTrackersByProjectId,
} from '../store/trackers/trackers.selectors'
import {
  selectSelectedStringId,
  selectStringsByProjectId,
  selectStringsByTrackerId,
} from '../store/strings/strings.selectors'
import {
  selectPanelsByProjectId,
  selectPanelsByTrackerId,
} from '../store/panels/panels.selectors'
import { map } from 'rxjs/operators'
import { TrackerModel } from '../models/tracker.model'
import { StringModel } from '../models/string.model'
import { PanelModel } from '../models/panel.model'
import { ProjectsService } from '../services/projects.service'
import { selectProjectByRouteParams } from '../store/projects/projects.selectors'
import { ProjectModel } from '../models/project.model'

export interface ProjectStore {
  project?: ProjectModel
  inverters?: InverterModel[]
  trackers?: TrackerModel[]
  strings?: StringModel[]
  panels?: PanelModel[]
}

@Component({
  selector: 'app-project-id',
  templateUrl: './project-id.component.html',
  styleUrls: ['./project-id.component.scss'],
})
export class ProjectIdComponent implements OnInit {
  // we create an object that contains coordinates
  menuTopLeftPosition = { x: '0', y: '0' }
  inverterBool: boolean[] = [false, false, false]
  trackerBool: boolean[] = [false, false, false]
  stringBool: boolean[] = [false, false, false]

  // reference to the MatMenuTrigger in the DOM
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger!: MatMenuTrigger

  store$?: Observable<ProjectStore>
  trackerTree$!: Observable<{
    project?: ProjectModel
    inverter?: InverterModel
    tracker?: TrackerModel
    strings?: StringModel[]
    panels?: PanelModel[]
  }>
  gridState$!: Observable<{ selectedStringId?: number }>
  view?: InverterModel

  constructor(
    private store: Store<AppState>,
    private projects: ProjectsService,
  ) {}

  ngOnInit(): void {
    this.trackerTree$ = combineLatest([
      this.store.select(selectProjectByRouteParams),
      this.store.select(
        selectInverterById({
          id: 11,
        }),
      ),
      this.store.select(
        selectTrackerById({
          id: 6,
        }),
      ),
      this.store.select(
        selectStringsByTrackerId({
          trackerId: 6,
        }),
      ),
      this.store.select(
        selectPanelsByTrackerId({
          trackerId: 6,
        }),
      ),
    ]).pipe(
      map(([project, inverter, tracker, strings, panels]) => ({
        project,
        inverter,
        tracker,
        strings,
        panels,
      })),
    )

    this.store
      .select(selectProjectByRouteParams)
      .subscribe((project) => console.log(project))
    this.projects.getDataByProjectId(3).then(async () => {
      // this.inverters.getInvertersByProjectId(project.id).then(async () => {
      // await this.router.navigateByUrl(`/projects/${project.id}`);
      // this.treenodes.initTreeNode(project.id);
      // await this.router.navigate([`${project.id}`], { relativeTo: this.route });
    })
    this.store$ = combineLatest([
      this.store.select(selectProjectByRouteParams),
      this.store.select(
        selectInvertersByProjectId({
          projectId: 3,
        }),
      ),
      this.store.select(
        selectTrackersByProjectId({
          projectId: 3,
        }),
      ),
      this.store.select(
        selectStringsByProjectId({
          projectId: 3,
        }),
      ),
      this.store.select(
        selectPanelsByProjectId({
          projectId: 3,
        }),
      ),
    ]).pipe(
      map(([project, inverters, trackers, strings, panels]) => ({
        project,
        inverters,
        trackers,
        strings,
        panels,
      })),
    )
    this.gridState$ = combineLatest([
      this.store.select(selectSelectedStringId),
    ]).pipe(
      map(([selectedStringId]) => ({
        selectedStringId,
      })),
    )
  }

  onRightClick(event: MouseEvent) {
    // preventDefault avoids to show the visualization of the right-click menu of the browser
    event.preventDefault()

    // we record the mouse position in our object
    this.menuTopLeftPosition.x = event.clientX + 'px'
    console.log(this.menuTopLeftPosition.x)
    this.menuTopLeftPosition.y = event.clientY + 'px'
    console.log(this.menuTopLeftPosition.y)
    // we open the menu
    // we pass to the menu the information about our object
    // this.matMenuTrigger.menuData = { item: item };

    // we open the menu
    this.matMenuTrigger.openMenu()
  }

  onRouteToInverter(inverter: InverterModel) {}

  click() {
    console.log('click')
  }

  toggleInverter(inverter: InverterModel, index: number) {
    this.inverterBool[index] = !this.inverterBool[index]
    console.log(this.inverterBool[index])
  }

  toggleTracker(tracker: TrackerModel, index: number) {
    this.trackerBool[index] = !this.trackerBool[index]
    console.log(this.trackerBool[index])
  }

  toggleString(stringModel: StringModel, index: number) {
    this.stringBool[index] = !this.stringBool[index]
    console.log(this.stringBool[index])
  }

  updateView(event: InverterModel) {
    console.log(event)
    this.view = event
  }

  /*  reRenderRoot($event: boolean) {
      this.ngOnInit()
    }*/
}
