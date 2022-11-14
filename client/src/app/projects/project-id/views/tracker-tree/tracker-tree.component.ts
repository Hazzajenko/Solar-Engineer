import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { StringModel } from '../../../models/string.model'
import { PanelModel } from '../../../models/panel.model'
import { ProjectModel } from '../../../models/project.model'
import { InverterModel } from '../../../models/inverter.model'
import { TrackerModel } from '../../../models/tracker.model'
import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { GridService } from '../../../services/grid.service'
import { combineLatest, Observable } from 'rxjs'
import { selectProjectByRouteParams } from '../../../store/projects/projects.selectors'
import { selectInverterById } from '../../../store/inverters/inverters.selectors'
import { selectTrackerById } from '../../../store/trackers/trackers.selectors'
import { selectStringsByTrackerId } from '../../../store/strings/strings.selectors'
import { selectPanelsByTrackerId } from '../../../store/panels/panels.selectors'
import { map } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { StringsService } from '../../../services/strings.service'

@Component({
  selector: 'app-tracker-tree',
  templateUrl: './tracker-tree.component.html',
  styleUrls: ['./tracker-tree.component.scss'],
})
export class TrackerTreeComponent implements OnInit {
  @Input() project?: ProjectModel
  @Input() inverter?: InverterModel
  @Input() tracker?: TrackerModel
  @Input() strings?: StringModel[]
  @Input() panels?: PanelModel[]
  @Output() reRenderRoot = new EventEmitter<boolean>()
  gridNumbers: string[] = []
  stringBool: boolean[] = [false, false, false]
  trackerTree$!: Observable<{
    project?: ProjectModel
    inverter?: InverterModel
    tracker?: TrackerModel
    strings?: StringModel[]
    panels?: PanelModel[]
  }>

  constructor(
    public grid: GridService,
    private store: Store<AppState>,
    private stringsService: StringsService,
  ) {}

  ngOnInit(): void {
    this.gridNumbers = this.grid.getNumbers(100)
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
    combineLatest([
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
    ])
      .pipe(
        map(([project, inverter, tracker, strings, panels]) => ({
          project,
          inverter,
          tracker,
          strings,
          panels,
        })),
      )
      .subscribe((bom) => console.log('BOMMM', bom))
  }

  toggleString(stringModel: StringModel, index: number) {
    this.stringBool[index] = !this.stringBool[index]
    console.log(this.stringBool[index])
  }

  taskDrop(event: CdkDragDrop<any, any>) {
    console.log(event)
  }

  createString(
    project: ProjectModel,
    inverter: InverterModel,
    tracker: TrackerModel,
  ) {
    this.stringsService
      .createString(project.id, inverter.id, tracker.id, 'newString!!')
      .then((res) => res)
  }
}
