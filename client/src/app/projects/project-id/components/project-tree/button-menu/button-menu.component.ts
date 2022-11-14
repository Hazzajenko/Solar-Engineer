import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { InverterModel } from '../../../../models/inverter.model'
import { TrackerModel } from '../../../../models/tracker.model'
import { StringModel } from '../../../../models/string.model'
import { InvertersService } from '../../../../services/inverters.service'
import { TrackersService } from '../../../../services/trackers.service'
import { StringsService } from '../../../../services/strings.service'
import { PanelsService } from '../../../../services/panels.service'
import { UnitModel } from '../../../../models/unit.model'
import { AppState } from '../../../../../store/app.state'
import { Store } from '@ngrx/store'
import { selectString } from '../../../../store/strings/strings.actions'
import {
  clearGridState,
  selectTrackerStringsForGrid,
} from '../../../../store/grid/grid.actions'
import { Observable } from 'rxjs'
import { selectStringsByProjectIdRouteParams } from '../../../../store/strings/strings.selectors'

@Component({
  selector: 'app-button-menu',
  templateUrl: './button-menu.component.html',
  styleUrls: ['./button-menu.component.scss'],
})
export class ButtonMenuComponent implements OnInit {
  @Input() model?: UnitModel
  @Input() projectId?: number
  @Input() inverter?: InverterModel
  @Input() tracker?: TrackerModel
  @Input() string?: StringModel
  @Output() reRender = new EventEmitter<boolean>()

  strings$!: Observable<StringModel[]>

  constructor(
    private invertersService: InvertersService,
    private trackersService: TrackersService,
    private stringsService: StringsService,
    private panelsService: PanelsService,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.strings$ = this.store.select(selectStringsByProjectIdRouteParams)
  }

  selectTrackerStrings(strings: StringModel[]) {
    this.store.dispatch(clearGridState())
    this.store.dispatch(selectTrackerStringsForGrid({ strings }))
  }

  selectString(string: StringModel) {
    this.store.dispatch(selectString({ string }))
  }

  async createTracker(projectId: number, inverter: InverterModel) {
    await this.trackersService.createTrackers(projectId, inverter.id)
  }

  async createString(
    projectId: number,
    inverter: InverterModel,
    tracker: TrackerModel,
  ) {
    await this.stringsService.createString(
      projectId,
      inverter.id,
      tracker.id,
      'new string',
    )
  }

  async changeStringColor(color: string) {
    await this.stringsService.updateStringColor(
      this.projectId!,
      this.string!,
      color,
    )
  }

  async deleteTracker(tracker: TrackerModel) {
    if (this.projectId) {
      await this.trackersService.deleteTracker(this.projectId, tracker.id)
    }
  }

  selectInverterStrings(strings: StringModel[]) {
    this.store.dispatch(clearGridState())
    this.store.dispatch(selectTrackerStringsForGrid({ strings }))
  }

  async deleteInverter(inverter: InverterModel) {
    if (this.projectId) {
      await this.invertersService.deleteInverter(this.projectId, inverter.id)
    }
  }

  async deleteString(string: StringModel) {
    if (this.projectId) {
      await this.stringsService.deleteString(this.projectId, string.id)
    }
  }
}
