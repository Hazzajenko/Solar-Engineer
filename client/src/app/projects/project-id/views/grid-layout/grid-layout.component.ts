import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { InverterModel } from '../../../models/inverter.model'
import { TrackerModel } from '../../../models/tracker.model'
import { StringModel } from '../../../models/string.model'
import { PanelModel } from '../../../models/panel.model'
import { PanelsService } from '../../../services/panels.service'
import { select, Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import {
  selectStringById,
  selectStringsByTrackerId,
} from '../../../store/strings/strings.selectors'
import { map, take } from 'rxjs/operators'
import { GridService } from '../../../services/grid.service'
import {
  selectPanelsByProjectId,
  selectPanelsByTrackerId,
} from '../../../store/panels/panels.selectors'
import { combineLatest, Observable } from 'rxjs'
import { selectProjectByRouteParams } from '../../../store/projects/projects.selectors'
import { selectInverterById } from '../../../store/inverters/inverters.selectors'
import { selectTrackerById } from '../../../store/trackers/trackers.selectors'
import { ProjectModel } from '../../../models/project.model'
import { MatMenuTrigger } from '@angular/material/menu'
import { CreateMode } from '../../../store/grid/grid.actions'
import {
  selectCreateMode,
  selectSelectedStrings,
} from '../../../store/grid/grid.selectors'

@Component({
  selector: 'app-grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.scss'],
})
export class GridLayoutComponent implements OnInit {
  @Input() inverters?: InverterModel[]
  @Input() trackers?: TrackerModel[]
  @Input() strings?: StringModel[]
  @Input() panels?: PanelModel[]
  @Input() selectedStringId?: number
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  public context!: CanvasRenderingContext2D
  createMode$?: Observable<CreateMode | undefined>
  createMode?: CreateMode | undefined
  selectedStrings$?: Observable<StringModel[] | undefined>
  occupiedSpots: string[] = []
  trackerTree$!: Observable<{
    project?: ProjectModel
    inverter?: InverterModel
    tracker?: TrackerModel
    strings?: StringModel[]
    panels?: PanelModel[]
  }>

  constructor(
    private panelsService: PanelsService,
    private store: Store<AppState>,
    public grid: GridService,
  ) {
    this.panels?.forEach((panel) => {
      // console.log(panel?.location)
    })
  }

  ngOnInit(): void {
    this.createMode$ = this.store.select(selectCreateMode)
    this.selectedStrings$ = this.store.select(selectSelectedStrings)

    this.panels?.forEach((panel) => {
      // console.log(panel?.location)
    })

    this.store
      .select(
        selectPanelsByProjectId({
          projectId: 3,
        }),
      )
      .subscribe((panels) => {
        // console.log(panels)
        panels.forEach((panel) => {
          // console.log(panel?.location)
          this.occupiedSpots.push(panel?.location)
        })
        // console.log(this.occupiedSpots)
      })
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
  }

  numSequence(n: number): Array<number> {
    return Array(n)
  }

  async taskDrop(event: CdkDragDrop<PanelModel, any>) {
    moveItemInArray(this.panels!, event.previousIndex, event.currentIndex)
    // console.log('previousIndex', event.previousIndex)
    // console.log('currentIndex', event.currentIndex)

    const panel = event.item.data
    const update: PanelModel = {
      id: panel.id,
      inverter_id: panel.inverter_id,
      tracker_id: panel.tracker_id,
      string_id: panel.string_id,
      location: event.container.id,
      version: panel.version,
    }
    const doesExist = this.panels?.find(
      (panel) => panel.location === event.container.id,
    )
    if (doesExist) {
      console.log('location taken')
      return
    }
    await this.panelsService.updatePanel(3, update)
  }

  divClick(location: string, event: MouseEvent, thing: HTMLDivElement) {
    if (!this.selectedStringId) console.log('select string')

    if (this.selectedStringId) {
      const doesExist = this.panels?.find(
        (panel) => panel.location === location,
      )
      if (doesExist) {
        console.log('location taken')
        return
      }
      const selectedString = this.store.pipe(
        select(selectStringById({ id: this.selectedStringId })),
      )
      if (!selectedString) {
        console.log('select string')
        return
      }
      selectedString.pipe(take(1))
      this.store
        .select(selectStringById({ id: this.selectedStringId }))
        .subscribe(async (string) => {
          if (string) {
            await this.panelsService.createPanelFromGrid(
              3,
              string.inverter_id,
              string.tracker_id,
              string.id,
              location,
            )
          }
        })
    }
  }

  onRightClick(event: MouseEvent, panel: PanelModel) {
    event.preventDefault()

    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    // console.log(this.menuTopLeftPosition.x)
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.menuData = { panel }

    this.matMenuTrigger.openMenu()
  }

  click() {}

  async deletePanel(panel: PanelModel) {
    console.log('delete')
    await this.panelsService.deletePanel(3, panel.id)
  }
}
