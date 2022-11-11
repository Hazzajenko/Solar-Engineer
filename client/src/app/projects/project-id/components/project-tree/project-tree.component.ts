import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core'
import { InverterModel } from '../../../models/inverter.model'
import { TrackerModel } from '../../../models/tracker.model'
import { StringModel } from '../../../models/string.model'
import { PanelModel } from '../../../models/panel.model'
import { Sort } from '@angular/material/sort'
import { MatMenuTrigger } from '@angular/material/menu'
import { InvertersService } from '../../../services/inverters.service'
import { TrackersService } from '../../../services/trackers.service'
import { StringsService } from '../../../services/strings.service'
import { PanelsService } from '../../../services/panels.service'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'

@Component({
    selector: 'app-project-tree',
    templateUrl: './project-tree.component.html',
    styleUrls: ['./project-tree.component.scss'],
})
export class ProjectTreeComponent implements OnInit {
    @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger!: MatMenuTrigger
    @Input() inverters?: InverterModel[]
    @Input() trackers?: TrackerModel[]
    @Input() strings?: StringModel[]
    @Input() panels?: PanelModel[]
    @Output() inverterView = new EventEmitter<InverterModel>()

    menuTopLeftPosition = { x: '0', y: '0' }

    inverterBool: boolean[] = [false, false, false]
    trackerBool: boolean[] = [false, false, false]
    stringBool: boolean[] = [false, false, false]

    constructor(
        private invertersService: InvertersService,
        private trackersService: TrackersService,
        private stringsService: StringsService,
        private panelsService: PanelsService
    ) {}

    ngOnInit(): void {}

    drop(event: CdkDragDrop<StringModel[]>) {
        moveItemInArray(this.strings!, event.previousIndex, event.currentIndex)
        // this.boardService.sortBoards(this.boards);
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

    sortData($event: Sort) {}

    onRightClick(event: MouseEvent, inverter: InverterModel) {
        // preventDefault avoids to show the visualization of the right-click menu of the browser
        event.preventDefault()

        // we record the mouse position in our object
        this.menuTopLeftPosition.x = event.clientX + 'px'
        console.log(this.menuTopLeftPosition.x)
        this.menuTopLeftPosition.y = event.clientY + 'px'
        console.log(this.menuTopLeftPosition.y)
        // we open the menu
        // we pass to the menu the information about our object
        this.matMenuTrigger.menuData = { item: inverter }

        // we open the menu
        this.matMenuTrigger.openMenu()
    }

    openMenu(event: MouseEvent, inverter: InverterModel) {
        event.preventDefault()

        // we record the mouse position in our object
        this.menuTopLeftPosition.x = event.clientX + 'px'
        console.log(this.menuTopLeftPosition.x)
        this.menuTopLeftPosition.y = event.clientY + 'px'
        console.log(this.menuTopLeftPosition.y)
        this.matMenuTrigger.menuData = { item: inverter }

        // we open the menu
        this.matMenuTrigger.openMenu()
    }

    click() {
        console.log('click')
    }

    selectNewView(inverter: InverterModel) {
        this.inverterView.emit(inverter)
    }

    createInverter(projectId: number) {
        this.invertersService
            .createInverterByProjectId(projectId)
            .then((res) => {
                console.log(res)
            })
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

    taskDrop(event: CdkDragDrop<StringModel[] | PanelModel[], any>) {
        if (event.item.data.model === 2) {
            moveItemInArray(
                this.strings!,
                event.previousIndex,
                event.currentIndex
            )
            console.log('previousIndex', event.previousIndex)
            console.log('currentIndex', event.currentIndex)
            console.log(event)
            console.log(event.item.data)
            const string = event.item.data
            console.log(event.item.data.trackerId)
            const newTracker = Number(event.container.id)
            const update: StringModel = {
                id: string.id,
                projectId: string.projectId,
                inverterId: string.inverterId,
                trackerId: newTracker,
                model: 2,
                name: string.name,
                isInParallel: string.isInParallel,
                panelAmount: string.panelAmount,
                version: string.version,
            }

            this.stringsService
                .updateString(3, update)
                .then((res) => console.log(res))
        } else {
            console.log('no')
            moveItemInArray(
                this.panels!,
                event.previousIndex,
                event.currentIndex
            )
            console.log('previousIndex', event.previousIndex)
            console.log('currentIndex', event.currentIndex)
            console.log(event)
            console.log(event.item.data)
            const panel = event.item.data
            const newString = Number(event.container.id)
            const update: PanelModel = {
                id: panel.id,
                projectId: panel.projectId,
                inverterId: panel.inverterId,
                trackerId: panel.trackerId,
                stringId: newString,
                location: panel.location,
                version: panel.version,
            }
            this.panelsService
                .updatePanel(3, update)
                .then((res) => console.log(res))
        }
    }
}
