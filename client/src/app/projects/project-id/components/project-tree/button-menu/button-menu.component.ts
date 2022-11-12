import { Component, Input, OnInit } from '@angular/core'
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

    constructor(
        private invertersService: InvertersService,
        private trackersService: TrackersService,
        private stringsService: StringsService,
        private panelsService: PanelsService,
        private store: Store<AppState>
    ) {}

    ngOnInit(): void {}

    create() {
        switch (this.model) {
            case 1:
                this.createTracker(this.projectId!, this.inverter!)
                break
            case 2:
                this.createString(
                    this.projectId!,
                    this.inverter!,
                    this.tracker!
                )
                break
            case 3:
                this.createPanel(
                    this.projectId!,
                    this.inverter!,
                    this.tracker!,
                    this.string!
                )
                break
            default:
                console.log('.')
                break
        }
    }

    select() {
        switch (this.model) {
            case 1:
                // this.createTracker(this.projectId!, this.inverter!);
                break
            case 2:
                // this.createString(this.projectId!, this.inverter!, this.tracker!);
                // this.selectString(this.projectId!, this.string!)
                break
            case 3:
                this.selectString(this.projectId!, this.string!)
                /*                this.createPanel(
                    this.projectId!,
                    this.inverter!,
                    this.tracker!,
                    this.string!
                )*/
                break
            default:
                // console.log('.');
                break
        }
    }

    selectString(projectId: number, string: StringModel) {
        this.store.dispatch(selectString({ string }))
    }

    createTracker(projectId: number, inverter: InverterModel) {
        this.trackersService
            .createTrackers(projectId, inverter.id)
            .then((res) => {
                console.log(res)
            })
    }

    createString(
        projectId: number,
        inverter: InverterModel,
        tracker: TrackerModel
    ) {
        this.stringsService
            .createString(projectId, inverter.id, tracker, 'new string')
            .then((res) => {
                console.log(res)
            })
    }

    createPanel(
        projectId: number,
        inverter: InverterModel,
        tracker: TrackerModel,
        stringModel: StringModel
    ) {
        // stringModel.panelAmount = stringModel.panelAmount! + 1;
        if (stringModel.panelAmount) {
            // const updateString = stringModel;
            /*      if (stringModel.panelAmount === 0) {
updateString.panelAmount = 1;
} else {
updateString.panelAmount!++;
}*/
            let panelAmount = stringModel.panelAmount + 1

            const updateString: StringModel = {
                id: stringModel.id,
                projectId: stringModel.projectId,
                inverterId: stringModel.inverterId,
                trackerId: stringModel.trackerId,
                model: 2,
                panelAmount,
                name: stringModel.name,
                isInParallel: stringModel.isInParallel,
                version: stringModel.version,
                createdAt: stringModel.createdAt,
            }
            this.panelsService
                .createPanel(projectId, inverter.id, tracker.id, updateString)
                .then((res) => {
                    console.log(res)
                })
        } else {
            const updateString: StringModel = {
                id: stringModel.id,
                projectId: stringModel.projectId,
                inverterId: stringModel.inverterId,
                trackerId: stringModel.trackerId,
                model: 2,
                panelAmount: 1,
                name: stringModel.name,
                isInParallel: stringModel.isInParallel,
                version: stringModel.version,
                createdAt: stringModel.createdAt,
            }
            this.panelsService
                .createPanel(projectId, inverter.id, tracker.id, updateString)
                .then((res) => {
                    console.log(res)
                })
        }
    }
}
