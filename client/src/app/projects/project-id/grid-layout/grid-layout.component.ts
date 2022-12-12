import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core'
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { firstValueFrom, Observable } from 'rxjs'
import { selectProjectByRouteParams } from '../services/store/projects/projects.selectors'
import { ProjectModel } from '../../models/project.model'
import { selectGridMode } from '../services/store/grid/grid.selectors'
import { BlockModel } from '../../models/block.model'
import { selectBlocksByProjectIdRouteParams } from '../services/store/blocks/blocks.selectors'
import { GridMode } from '../services/store/grid/grid-mode.model'
import { PanelsEntityService } from '../services/ngrx-data/panels-entity/panels-entity.service'
import { CablesEntityService } from '../services/ngrx-data/cables-entity/cables-entity.service'
import { StringsEntityService } from '../services/ngrx-data/strings-entity/strings-entity.service'
import { InvertersEntityService } from '../services/ngrx-data/inverters-entity/inverters-entity.service'
import { TrackersEntityService } from '../services/ngrx-data/trackers-entity/trackers-entity.service'
import { JoinsEntityService } from '../services/ngrx-data/joins-entity/joins-entity.service'
import { MatMenuModule } from '@angular/material/menu'
import { CommonModule } from '@angular/common'
import { LetModule } from '@ngrx/component'
import { GetGridStringPipe } from '../../../pipes/get-grid-string.pipe'
import { FindBlockNumberPipe } from '../../../pipes/find-block-number.pipe'
import { FindInverterLocationPipe } from '../../../pipes/find-inverter-location.pipe'
import { MatTooltipModule } from '@angular/material/tooltip'
import { FindPanelLocationPipe } from '../../../pipes/find-panel-location.pipe'
import { FindCableLocationPipe } from '../../../pipes/find-cable-location.pipe'
import { GetCableSurroundingsPipe } from '../../../pipes/get-cable-surroundings.pipe'
import { TopBottomSvgComponent } from '../../../svgs/grid/top-bottom-svg.component'
import { LeftTopSvgComponent } from '../../../svgs/grid/left-top-svg.component'
import { BottomSvgComponent } from '../../../svgs/grid/bottom-svg.component'
import { LeftRightSvgComponent } from '../../../svgs/grid/left-right-svg.component'
import { RightSvgComponent } from '../../../svgs/grid/right-svg.component'
import { CableJoinComponent } from '../../../components/cable-join/cable-join.component'
import { GetNearbyJoins } from '../../../pipes/get-nearby-joins.pipe'
import { BlockPanelComponent } from './block-switch/block-panel/block-panel.component'
import { BlockCableComponent } from './block-switch/block-cable/block-cable.component'
import { BlockInverterComponent } from './block-switch/block-inverter/block-inverter.component'
import { GridLayoutDirective } from '../../../directives/grid-layout.directive'
import { DisconnectionPointsEntityService } from '../services/ngrx-data/disconnection-points-entity/disconnection-points-entity.service'
import { BlockDisconnectionPointComponent } from './block-switch/block-disconnection-point/block-disconnection-point.component'
import { FindDisconnectionPointLocationPipe } from '../../../pipes/find-disconnection-point-location.pipe'
import { GetPanelPipe } from '../../../pipes/get-panel.pipe'
import { GetCablePipe } from '../../../pipes/get-cable.pipe'
import { BlockSwitchComponent } from './block-switch/block-switch.component'
import { BlockByLocationPipe } from './block-by-location.pipe'
import { PanelLinksEntityService } from '../services/ngrx-data/panel-links-entity/panel-links-entity.service'
import { CreateService } from '../services/create.service'
import { DeleteService } from '../services/delete.service'
import { LinksService } from '../services/links/links.service'
import { UpdateService } from '../services/update.service'
import { MultiCreateService } from '../services/multi/multi-create.service'
import { selectMultiMode } from '../services/store/multi-create/multi.selectors'
import { MultiDeleteService } from '../services/multi/multi-delete.service'
import { MultiSelectService } from '../services/multi/multi-select.service'
import { MultiActions } from '../services/store/multi-create/multi.actions'

@Component({
  selector: 'app-grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.scss'],
  standalone: true,
  hostDirectives: [GridLayoutDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DragDropModule,
    LetModule,
    GetGridStringPipe,
    FindBlockNumberPipe,
    FindInverterLocationPipe,
    MatTooltipModule,
    FindPanelLocationPipe,
    FindCableLocationPipe,
    GetCableSurroundingsPipe,
    TopBottomSvgComponent,
    LeftTopSvgComponent,
    MatMenuModule,
    CommonModule,
    BottomSvgComponent,
    LeftRightSvgComponent,
    RightSvgComponent,
    CableJoinComponent,
    GetNearbyJoins,
    BlockPanelComponent,
    BlockCableComponent,
    BlockInverterComponent,
    BlockDisconnectionPointComponent,
    FindDisconnectionPointLocationPipe,
    GetPanelPipe,
    GetCablePipe,
    BlockSwitchComponent,
    BlockByLocationPipe,
  ],
})
export class GridLayoutComponent implements OnInit {
  @Output() clickEvent = new EventEmitter<MouseEvent>()
  @Output() altKeyUpEvent = new EventEmitter<KeyboardEvent>()
  @Output() mouseUpEvent = new EventEmitter<MouseEvent>()
  @Output() mouseDownEvent = new EventEmitter<MouseEvent>()
  @Output() mouseMoveEvent = new EventEmitter<MouseEvent>()

  project$!: Observable<ProjectModel | undefined>
  blocks$!: Observable<BlockModel[]>
  rows = 20
  cols = 40
  mouseIsDown: boolean = false
  mouseDownStartLocation?: string

  constructor(
    private store: Store<AppState>,
    private panelsEntity: PanelsEntityService,
    private cablesEntity: CablesEntityService,
    private stringsEntity: StringsEntityService,
    private invertersEntity: InvertersEntityService,
    private trackersEntity: TrackersEntityService,
    private joinsEntity: JoinsEntityService,
    private panelJoinsEntity: PanelLinksEntityService,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
    private createService: CreateService,
    private deleteService: DeleteService,
    private joinsService: LinksService,
    private updateService: UpdateService,
    private multiCreateService: MultiCreateService,
    private multiDeleteService: MultiDeleteService,
    private multiSelectService: MultiSelectService,
  ) {}

  async cellAction(location: string, event: MouseEvent) {
    if (event.altKey) {
      return
    }
    this.clickEvent.emit(event)

    const gridMode = await firstValueFrom(this.store.select(selectGridMode))
    switch (gridMode) {
      case GridMode.CREATE:
        this.createService.createSwitch(location)
        break

      case GridMode.DELETE:
        this.deleteService.deleteSwitch(location)
        break

      case GridMode.LINK:
        console.log('linkSwitch')
        this.joinsService.linkSwitch(location, event.shiftKey)
        break
      default:
        this.createService.createSwitch(location)
        break
    }
  }

  gridDrop(event: CdkDragDrop<any, any>) {
    this.updateService.gridDrop(event)
  }

  ngOnInit(): void {
    this.project$ = this.store.select(selectProjectByRouteParams)
    this.blocks$ = this.store.select(selectBlocksByProjectIdRouteParams)
  }

  numSequence(n: number): Array<number> {
    return Array(n)
  }

  async mouseDown(event: MouseEvent, location: string) {
    event.preventDefault()
    event.stopPropagation()
    if (event.altKey) {
      this.mouseDownEvent.emit(event)
      const gridMode = await firstValueFrom(this.store.select(selectGridMode))
      switch (gridMode) {
        case GridMode.CREATE:
          this.multiCreateService.multiCreate(location)
          break
        case GridMode.SELECT:
          this.multiSelectService.multiSelect(location)
          break
        case GridMode.DELETE:
          this.multiDeleteService.multiDelete(location)
          break
      }
    }
  }

  async mouseUp(event: MouseEvent, location: string) {
    const multiMode = await firstValueFrom(this.store.select(selectMultiMode))
    if (!multiMode) {
      return
    }
    this.mouseUpEvent.emit(event)
    const gridMode = await firstValueFrom(this.store.select(selectGridMode))
    switch (gridMode) {
      case GridMode.CREATE:
        this.multiCreateService.multiCreate(location)
        break
      case GridMode.SELECT:
        this.multiSelectService.multiSelect(location)
        break
      case GridMode.DELETE:
        this.multiDeleteService.multiDelete(location)
        break
    }
  }

  @HostListener('window:keyup', ['$event'])
  async altKeyup(event: KeyboardEvent) {
    event.preventDefault()
    event.stopPropagation()
    console.log(event)
    if (event.key === 'Alt') {
      this.altKeyUpEvent.emit(event)
      const multiMode = await firstValueFrom(this.store.select(selectMultiMode))
      if (multiMode) {
        this.store.dispatch(MultiActions.clearMultiState())
      }
    }
  }
}
