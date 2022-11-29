import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatTooltipModule } from '@angular/material/tooltip'
import { AsyncPipe, NgIf, NgStyle } from '@angular/common'
import { LetModule } from '@ngrx/component'
import { DisconnectionPointModel } from '../../../models/disconnection-point.model'
import { DisconnectionPointsEntityService } from '../../services/disconnection-points-entity/disconnection-points-entity.service'
import { distinctUntilChanged, Observable } from 'rxjs'
import { UnitModel } from '../../../models/unit.model'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { PanelJoinsEntityService } from '../../services/panel-joins-entity/panel-joins-entity.service'
import { PanelLinkComponent } from '../../../../components/panel-link/panel-link.component'
import { RightClick } from '../grid-layout/block-switch/right-click'
import { GridMode } from '../../../store/grid/grid-mode.model'
import { JoinsState } from '../../../store/joins/joins.reducer'
import { selectGridMode } from '../../../store/grid/grid.selectors'
import { map } from 'rxjs/operators'
import { selectJoinsState } from '../../../store/joins/joins.selectors'
import {
  selectSelectedId,
  selectSelectedNegativeTo,
  selectSelectedPositiveTo,
  selectUnitSelected,
} from '../../../store/selected/selected.selectors'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { SelectedStateActions } from '../../../store/selected/selected.actions'
import { GridStateActions } from '../../../store/grid/grid.actions'
import { JoinsService } from '../../../services/joins.service'

@Component({
  selector: 'app-block-disconnection-point',
  templateUrl: './block-disconnection-point.component.html',
  styleUrls: ['./block-disconnection-point.component.scss'],
  imports: [
    DragDropModule,
    MatTooltipModule,
    NgStyle,
    NgIf,
    AsyncPipe,
    LetModule,
    PanelLinkComponent,
    MatMenuModule,
  ],
  standalone: true,
})
export class BlockDisconnectionPointComponent implements OnInit {
  @ViewChild('disconnectionPointDiv') disconnectionPointDiv!: ElementRef
  @Input() location!: string
  @Output() rightClickDp = new EventEmitter<RightClick>()
  gridMode$!: Observable<GridMode | undefined>
  disconnectionPoint$!: Observable<DisconnectionPointModel | undefined>
  joinState$!: Observable<JoinsState>
  selectedId$!: Observable<string | undefined>
  selectedPositiveTo$!: Observable<string | undefined>
  selectedNegativeTo$!: Observable<string | undefined>
  selectedUnit$!: Observable<UnitModel | undefined>
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger

  constructor(
    public disconnectionPointsEntity: DisconnectionPointsEntityService,
    private store: Store<AppState>,
    private panelJoinsEntity: PanelJoinsEntityService,
    private joinsService: JoinsService,
  ) {}

  displayTooltip(disconnectionPoint: DisconnectionPointModel): string {
    return `
       Location = ${disconnectionPoint.location} \r\n
       String: ${disconnectionPoint.string_id} \r\n
    `
  }

  onRightClick(event: MouseEvent, dp: DisconnectionPointModel) {
    event.preventDefault()
    // this.rightClickDp.emit({ event, item: dp })

    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.menuData = { dp }
    this.matMenuTrigger.openMenu()
  }

  ngOnInit() {
    this.gridMode$ = this.store.select(selectGridMode)
    this.disconnectionPoint$ = this.disconnectionPointsEntity.entities$.pipe(
      map((dps) => dps.find((dp) => dp.location === this.location)),
    )
    // this.dpToJoin$ = this.store.select(selectDpToJoin)
    this.selectedId$ = this.store
      .select(selectSelectedId)
      .pipe(distinctUntilChanged())
    this.selectedPositiveTo$ = this.store.select(selectSelectedPositiveTo)
    this.selectedNegativeTo$ = this.store.select(selectSelectedNegativeTo)
    this.selectedUnit$ = this.store.select(selectUnitSelected)
    // this.selectedStringTooltip$ = this.store.select(selectSelectedStringTooltip)
    this.joinState$ = this.store.select(selectJoinsState)
  }

  dpAction(
    disconnectionPoint: DisconnectionPointModel,
    gridMode?: GridMode | null,
    joinsState?: JoinsState | null,
  ) {
    if (!disconnectionPoint || !gridMode) return

    switch (gridMode) {
      case GridMode.JOIN:
        if (joinsState) {
          this.joinsService.addPanelToJoin(panel, gridMode, joinsState)
        }
        break
      case GridMode.DELETE:
        this.panelsEntity.delete(panel)
        break
      case GridMode.SELECT:
        this.store.dispatch(
          SelectedStateActions.selectPanel({ panelId: panel.id }),
        )
        break
      default:
        this.store.dispatch(
          GridStateActions.changeGridmode({ mode: GridMode.SELECT }),
        )
        this.store.dispatch(
          SelectedStateActions.selectPanel({ panelId: panel.id }),
        )
        break
    }
  }

  deleteDisconnectionPoint(disconnectionPoint: DisconnectionPointModel) {}
}
