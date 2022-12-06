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
import { DisconnectionPointModel } from '../../../../models/disconnection-point.model'
import { DisconnectionPointsEntityService } from '../../../services/ngrx-data/disconnection-points-entity/disconnection-points-entity.service'
import { distinctUntilChanged, firstValueFrom, Observable } from 'rxjs'
import { UnitModel } from '../../../../models/unit.model'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { LinksEntityService } from '../../../services/ngrx-data/links-entity/links-entity.service'
import { PanelLinkComponent } from '../block-panel/panel-link/panel-link.component'
import { RightClick } from '../right-click'
import { GridMode } from '../../../services/store/grid/grid-mode.model'
import { LinksState } from '../../../services/store/links/links.reducer'
import { selectGridMode } from '../../../services/store/grid/grid.selectors'
import { map } from 'rxjs/operators'
import { selectDpToLink, selectLinksState } from '../../../services/store/links/links.selectors'
import {
  selectSelectedId,
  selectSelectedNegativeTo,
  selectSelectedPositiveTo,
  selectUnitSelected,
} from '../../../services/store/selected/selected.selectors'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { SelectedStateActions } from '../../../services/store/selected/selected.actions'
import { GridStateActions } from '../../../services/store/grid/grid.actions'
import { LinksService } from '../../../services/links.service'
import { LoggerService } from '../../../../../services/logger.service'

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
  joinState$!: Observable<LinksState>
  dpToJoin$!: Observable<DisconnectionPointModel | undefined>
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
    private panelJoinsEntity: LinksEntityService,
    private joinsService: LinksService,
    private logger: LoggerService,
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
    this.dpToJoin$ = this.store.select(selectDpToLink)
    this.selectedId$ = this.store.select(selectSelectedId).pipe(distinctUntilChanged())
    this.selectedPositiveTo$ = this.store.select(selectSelectedPositiveTo)
    this.selectedNegativeTo$ = this.store.select(selectSelectedNegativeTo)
    this.selectedUnit$ = this.store.select(selectUnitSelected)
    this.joinState$ = this.store.select(selectLinksState)
  }

  dpAction(disconnectionPoint: DisconnectionPointModel) {
    if (!disconnectionPoint) {
      return this.logger.error('err dpAction !disconnectionPoint')
    }

    firstValueFrom(this.store.select(selectGridMode))
      .then((gridMode) => {
        switch (gridMode) {
          case GridMode.JOIN:
            firstValueFrom(this.store.select(selectLinksState)).then((joinsState) => {
              this.joinsService.addDpToLink(disconnectionPoint, joinsState)
            })
            break

          case GridMode.DELETE:
            this.disconnectionPointsEntity.delete(disconnectionPoint)
            break
          case GridMode.SELECT:
            this.store.dispatch(SelectedStateActions.selectDp({ dpId: disconnectionPoint.id }))
            break
          default:
            this.store.dispatch(GridStateActions.changeGridmode({ mode: GridMode.SELECT }))
            this.store.dispatch(SelectedStateActions.selectDp({ dpId: disconnectionPoint.id }))
            break
        }
      })
      .catch((err) => {
        return this.logger.error('err dpAction this.store.select(selectGridMode)' + err)
      })
  }

  deleteDisconnectionPoint(disconnectionPoint: DisconnectionPointModel) {
    this.disconnectionPointsEntity.delete(disconnectionPoint)
  }
}
