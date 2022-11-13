import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core'
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

  constructor(
    private invertersService: InvertersService,
    private trackersService: TrackersService,
    private stringsService: StringsService,
    private panelsService: PanelsService,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {}

  async create() {
    switch (this.model) {
      case 0:
        break
      case 1:
        await this.createTracker(
          this.projectId!,
          this.inverter!,
        )
        break
      case 2:
        await this.createString(
          this.projectId!,
          this.inverter!,
          this.tracker!,
        )
        break
      case 3:
        break
      default:
        break
    }
  }

  select() {
    switch (this.model) {
      case 0:
        break
      case 1:
        break
      case 2:
        break
      case 3:
        this.selectString(this.projectId!, this.string!)
        break
      default:
        break
    }
  }

  selectString(projectId: number, string: StringModel) {
    this.store.dispatch(selectString({ string }))
  }

  async createTracker(
    projectId: number,
    inverter: InverterModel,
  ) {
    await this.trackersService.createTrackers(
      projectId,
      inverter.id,
    )
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
}
