import { ProjectModel } from '../../../../models/project.model'
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { PanelModel } from '../../../../models/panel.model'
import { GridMode } from '../../../services/store/grid/grid-mode.model'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatTooltipModule } from '@angular/material/tooltip'
import {
  AsyncPipe,
  NgClass,
  NgIf,
  NgStyle,
  NgTemplateOutlet,
} from '@angular/common'
import { FindPanelLocationPipe } from '../../../../../pipes/find-panel-location.pipe'
import { PanelsEntityService } from '../../../services/ngrx-data/panels-entity/panels-entity.service'
import { LinksEntityService } from '../../../services/ngrx-data/links-entity/links-entity.service'
import { LetModule } from '@ngrx/component'
import { GetPanelJoinPipe } from '../../../../../pipes/get-panel-join.pipe'
import { PanelDirective } from '../../../../../directives/panel.directive'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { PanelLinkComponent } from '../../../../../components/panel-link/panel-link.component'
import { StringsEntityService } from '../../../services/ngrx-data/strings-entity/strings-entity.service'
import { StatsService } from '../../../services/stats.service'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { BlockMenuComponent } from '../block-menu/block-menu.component'
import { RightClick } from '../right-click'
import { UnitModel } from '../../../../models/unit.model'
import { LoggerService } from '../../../../../services/logger.service'
import { GridStateActions } from '../../../services/store/grid/grid.actions'
import { SelectedStateActions } from '../../../services/store/selected/selected.actions'
import { LinksService } from 'src/app/projects/project-id/services/links.service'
import { distinctUntilChanged, firstValueFrom, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import {
  selectLinksState,
  selectPanelToLink,
} from '../../../services/store/links/links.selectors'
import {
  selectIfMultiSelect,
  selectMultiSelectIds,
  selectSelectedId,
  selectSelectedNegativeTo,
  selectSelectedPositiveTo,
  selectSelectedStringTooltip,
  selectUnitSelected,
} from '../../../services/store/selected/selected.selectors'
import { selectGridMode } from '../../../services/store/grid/grid.selectors'
import { LinksState } from '../../../services/store/links/links.reducer'

@Component({
  selector: 'app-block-panel',
  templateUrl: './block-panel.component.html',
  styleUrls: ['./block-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DragDropModule,
    MatTooltipModule,
    NgStyle,
    NgIf,
    FindPanelLocationPipe,
    AsyncPipe,
    LetModule,
    GetPanelJoinPipe,
    PanelDirective,
    PanelLinkComponent,
    MatMenuModule,
    BlockMenuComponent,
    NgTemplateOutlet,
    NgClass,
  ],
  standalone: true,
})
export class BlockPanelComponent implements OnInit {
  @ViewChild('panelDiv') panelDiv!: ElementRef
  @Input() project?: ProjectModel
  @Input() location!: string

  @Output() rightClickPanel = new EventEmitter<RightClick>()
  gridMode$!: Observable<GridMode | undefined>
  panel$!: Observable<PanelModel | undefined>
  panelToJoin$!: Observable<PanelModel | undefined>

  joinState$!: Observable<LinksState>
  selectedId$!: Observable<string | undefined>
  selectedPositiveTo$!: Observable<string | undefined>
  selectedNegativeTo$!: Observable<string | undefined>
  selectedUnit$!: Observable<UnitModel | undefined>
  selectedStringTooltip$!: Observable<string | undefined>
  multiSelectIds$!: Observable<string[] | undefined>
  multiSelect$!: Observable<boolean | undefined>
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger

  rightClickMenuClass: string = 'hidden'

  constructor(
    public panelsEntity: PanelsEntityService,
    public panelJoinsEntity: LinksEntityService,
    public stringsEntity: StringsEntityService,
    private joinsService: LinksService,
    public store: Store<AppState>,
    private statsService: StatsService,
    private logger: LoggerService,
  ) {}

  ngOnInit() {
    this.gridMode$ = this.store.select(selectGridMode)
    this.panel$ = this.panelsEntity.entities$.pipe(
      map((panels) => panels.find((panel) => panel.location === this.location)),
    )
    this.panelToJoin$ = this.store.select(selectPanelToLink)
    this.selectedId$ = this.store
      .select(selectSelectedId)
      .pipe(distinctUntilChanged())
    this.selectedPositiveTo$ = this.store.select(selectSelectedPositiveTo)
    this.selectedNegativeTo$ = this.store.select(selectSelectedNegativeTo)
    this.selectedUnit$ = this.store.select(selectUnitSelected)
    this.selectedStringTooltip$ = this.store.select(selectSelectedStringTooltip)
    this.joinState$ = this.store.select(selectLinksState)
    this.multiSelectIds$ = this.store.select(selectMultiSelectIds)
    this.multiSelect$ = this.store.select(selectIfMultiSelect)
  }

  displayTooltip(
    panel: PanelModel,
    selectedUnit?: UnitModel,
    selectedId?: string,
    selectedStringTooltip?: string,
  ): string {
    if (selectedUnit) {
      switch (selectedUnit) {
        case UnitModel.PANEL:
          return `
           Location = ${panel.location} \r\n
           String: ${panel.string_id} \r\n
          `
        case UnitModel.STRING:
          if (panel.string_id === selectedId) {
            if (selectedStringTooltip) {
              return selectedStringTooltip
            }
          }
      }
    }
    return `
       Location = ${panel.location} \r\n
       String: ${panel.string_id} \r\n
    `
  }

  onRightClick(event: MouseEvent, panel: PanelModel) {
    event.preventDefault()

    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.menuData = { panel }
    this.matMenuTrigger.openMenu()
  }

  selectString(panel: PanelModel) {
    this.store.dispatch(
      GridStateActions.changeGridmode({ mode: GridMode.SELECT }),
    )
    this.store.dispatch(
      SelectedStateActions.selectUnit({ unit: UnitModel.STRING }),
    )
    this.store.dispatch(
      SelectedStateActions.selectString({ stringId: panel.string_id }),
    )
  }

  deletePanel(panel: PanelModel) {
    this.panelsEntity.delete(panel)
  }

  panelAction(panel: PanelModel, shiftKey: boolean) {
    if (!panel) {
      return console.error('err panelAction !panel')
    }

    firstValueFrom(this.store.select(selectGridMode))
      .then((gridMode) => {
        switch (gridMode) {
          case GridMode.JOIN:
            firstValueFrom(this.store.select(selectLinksState)).then(
              (joinsState) => {
                this.joinsService.addPanelToLink(panel, joinsState)
              },
            )
            break
          case GridMode.DELETE:
            this.panelsEntity.delete(panel)
            break
          case GridMode.SELECT:
            if (shiftKey) {
              this.store.dispatch(
                SelectedStateActions.addPanelToMultiselect({
                  panelId: panel.id,
                }),
              )
            } else {
              this.store.dispatch(
                SelectedStateActions.selectPanel({ panelId: panel.id }),
              )
            }
            break
          default:
            this.store.dispatch(
              GridStateActions.changeGridmode({ mode: GridMode.SELECT }),
            )
            if (shiftKey) {
              this.store.dispatch(
                SelectedStateActions.addPanelToMultiselect({
                  panelId: panel.id,
                }),
              )
            } else {
              this.store.dispatch(
                SelectedStateActions.selectPanel({ panelId: panel.id }),
              )
            }
            break
        }
      })
      .catch((err) => {
        return console.error(
          'err panelAction this.store.select(selectGridMode)' + err,
        )
      })
  }
}
