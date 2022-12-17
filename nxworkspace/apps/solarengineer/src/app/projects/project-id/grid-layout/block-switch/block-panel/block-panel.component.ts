import { ProjectModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/project.model'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { PanelModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/panel.model'
import { GridMode } from '../../../services/store/grid/grid-mode.model'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatTooltipModule } from '@angular/material/tooltip'
import {
  AsyncPipe,
  NgClass,
  NgIf,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
  NgTemplateOutlet,
} from '@angular/common'
import { FindPanelLocationPipe } from '../../../../../pipes/find-panel-location.pipe'
import { PanelsEntityService } from '../../../services/ngrx-data/panels-entity/panels-entity.service'
import { PanelLinksEntityService } from '../../../services/ngrx-data/panel-links-entity/panel-links-entity.service'
import { LetModule } from '@ngrx/component'
import { GetPanelJoinPipe } from '../../../../../pipes/get-panel-join.pipe'
import { PanelDirective } from '../../../../../directives/panel.directive'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { PanelLinkComponent } from './panel-link/panel-link.component'
import { StringsEntityService } from '../../../services/ngrx-data/strings-entity/strings-entity.service'
import { StatsService } from '../../../services/stats.service'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { BlockMenuComponent } from '../block-menu/block-menu.component'
import { RightClick } from '../right-click'
import { TypeModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/type.model'
import { LoggerService } from '../../../../../services/logger.service'
import { GridStateActions } from '../../../services/store/grid/grid.actions'
import { SelectedStateActions } from '../../../services/store/selected/selected.actions'
import { LinksService } from 'src/app/projects/project-id/services/links/links.service'
import { combineLatestWith, firstValueFrom, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { selectLinksState, selectPanelToLink } from '../../../services/store/links/links.selectors'
import {
  selectIfMultiSelect,
  selectMultiSelectIds,
  selectSelectedNegativeTo,
  selectSelectedPanelId,
  selectSelectedPositiveTo,
  selectSelectedState,
  selectSelectedStringId,
  selectSelectedStringPathMap,
  selectSelectedStringTooltip,
  selectUnitSelected,
} from '../../../services/store/selected/selected.selectors'
import { selectCreateMode, selectGridMode } from '../../../services/store/grid/grid.selectors'
import { LinksState } from '../../../services/store/links/links.reducer'
import { HttpClient } from '@angular/common/http'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { ExistingStringsDialog } from '../../dialogs/existing-strings-dialog/existing-strings.dialog'
import { PanelTooltipAsyncPipe } from './panel-tooltip-async.pipe'
import { NewStringDialog } from '../../dialogs/new-string-dialog/new-string.dialog'
import { EditStringDialog } from '../../dialogs/edit-string-dialog/edit-string.dialog'
import { DarkColor, SoftColor, VibrantColor } from '../../../../../../../../../libs/shared/data-access/models/src/lib/color.model'

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
    PanelTooltipAsyncPipe,
    NgSwitch,
    NgSwitchCase,
  ],
  standalone: true,
})
export class BlockPanelComponent implements OnInit, AfterViewInit {
  @ViewChild('ElementRefName') element!: ElementRef

  @ViewChild('panelDiv') panelDiv!: ElementRef
  @Input() project?: ProjectModel
  @Input() id!: string
  // @Input() location!: string

  @Output() rightClickPanel = new EventEmitter<RightClick>()
  gridMode$!: Observable<GridMode | undefined>
  panel$!: Observable<PanelModel | undefined>
  panelToJoin$!: Observable<PanelModel | undefined>
  isPanelToJoin$!: Observable<boolean>

  joinState$!: Observable<LinksState>
  isInSelection$!: Observable<boolean>
  isSelectedPanel$!: Observable<boolean>
  isSelectedString$!: Observable<boolean>
  isOtherStringSelected$!: Observable<boolean>
  isSelectedPositiveTo$!: Observable<boolean>
  isSelectedNegativeTo$!: Observable<boolean>

  positivePanelLink$!: Observable<string | undefined>
  negativePanelLink$!: Observable<string | undefined>
  selectedUnit$!: Observable<TypeModel | undefined>
  selectedStringTooltip$!: Observable<string | undefined>
  stringColor$!: Observable<string | undefined>
  multiSelectIds$!: Observable<string[] | undefined>
  multiSelect$!: Observable<boolean | undefined>
  selectedStringPathMap$!: Observable<
    Map<string, { link: number; count: number; color: string }> | undefined
  >
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger

  rightClickMenuClass: string = 'hidden'

  divX!: number
  divY!: number

  constructor(
    public panelsEntity: PanelsEntityService,
    public linksEntity: PanelLinksEntityService,
    public stringsEntity: StringsEntityService,
    private joinsService: LinksService,
    public store: Store<AppState>,
    private statsService: StatsService,
    private logger: LoggerService,
    private http: HttpClient,
    private dialog: MatDialog,
    private elRef: ElementRef,
  ) {}

  ngAfterViewInit() {
    // const { x, y } = this.element.nativeElement.getBoundingClientRect()
    // const { x, y } = this.element.nativeElement.getBoundingClientRect()
    // this.divX = this.panelDiv.nativeElement.getBoundingClientRect().x
    // this.divY = this.panelDiv.nativeElement.getBoundingClientRect().y
    this.divX = this.panelDiv.nativeElement.getBoundingClientRect().left + window.scrollX
    this.divY = this.panelDiv.nativeElement.getBoundingClientRect().top + window.scrollY
    // const { x, y } = this.element.nativeElement.getBoundingClientRect()
    // console.log(this.element.nativeElement.getBoundingClientRect())
  }

  test(panelId: string) {
    console.log('test')
    // const { x, y } = this.element.nativeElement.getBoundingClientRect()
    // console.log(docrect.left + window.scrollX),
    //   console.log(docrect.top + window.scrollY)
    this.store.dispatch(
      SelectedStateActions.setSelectedStringLinkPathCoords({ panelId, x: this.divX, y: this.divY }),
    )
  }

  ngOnInit() {
    this.gridMode$ = this.store.select(selectGridMode)
    this.panel$ = this.panelsEntity.entities$.pipe(
      map((panels) => panels.find((panel) => panel.id === this.id)),
    )

    this.panelToJoin$ = this.store.select(selectPanelToLink)
    this.isPanelToJoin$ = this.store
      .select(selectPanelToLink)
      .pipe(map((panelToLink) => panelToLink?.id === this.id))
    this.isSelectedPanel$ = this.store
      .select(selectSelectedPanelId)
      .pipe(map((selectedPanelId) => selectedPanelId === this.id))

    this.isInSelection$ = this.store
      .select(selectSelectedPanelId)
      .pipe(combineLatestWith(this.store.select(selectMultiSelectIds)))
      .pipe(
        map(([selected, multiSelected]) => {
          return !!(selected === this.id || multiSelected?.includes(this.id))
        }),
      )
    // (isSelectedPanel$ | async)! || (multiSelectIds$ | async)?.includes(panel.id)
    this.isSelectedString$ = this.store
      .select(selectSelectedStringId)
      .pipe(combineLatestWith(this.panel$))
      .pipe(map(([selectedStringId, panel]) => selectedStringId === panel?.stringId))
    this.isOtherStringSelected$ = this.store
      .select(selectSelectedStringId)
      .pipe(combineLatestWith(this.panel$))
      .pipe(
        map(([selectedStringId, panel]) => {
          if (selectedStringId) {
            return selectedStringId !== panel?.stringId
          } else {
            return false
          }
        }),
      )
    this.isSelectedPositiveTo$ = this.store
      .select(selectSelectedPositiveTo)
      .pipe(map((positiveTo) => positiveTo === this.id))
    this.isSelectedNegativeTo$ = this.store
      .select(selectSelectedNegativeTo)
      .pipe(map((negativeTo) => negativeTo === this.id))
    this.positivePanelLink$ = this.linksEntity.entities$.pipe(
      map((links) => links.find((link) => link.negativeToId === this.id)),
      map((link) => link?.id),
    )
    this.negativePanelLink$ = this.linksEntity.entities$.pipe(
      map((links) => links.find((link) => link.positiveToId === this.id)),
      map((link) => link?.id),
    )
    this.stringColor$ = this.stringsEntity.entities$.pipe(combineLatestWith(this.panel$)).pipe(
      map(([strings, panel]) => strings.find((string) => string.id === panel?.stringId)),
      map((string) => string?.color),
    )
    this.selectedUnit$ = this.store.select(selectUnitSelected)
    this.selectedStringTooltip$ = this.store.select(selectSelectedStringTooltip)
    this.joinState$ = this.store.select(selectLinksState)
    this.multiSelectIds$ = this.store.select(selectMultiSelectIds)
    this.multiSelect$ = this.store.select(selectIfMultiSelect)
    this.selectedStringPathMap$ = this.store.select(selectSelectedStringPathMap)
  }

  displayTooltip(
    panel: PanelModel,
    isSelectedString: boolean,
    selectedStringTooltip?: string,
    selectedUnit?: TypeModel,
    selectedId?: boolean,
    stringName?: string,
  ): string {
    if (isSelectedString) {
      return <string>selectedStringTooltip
    }
    return ''
    /* else {
      return `
    ${panel.id}
      Location = ${panel.location} \r\n
    `
    }*/

    /*    if (selectedUnit) {
          switch (selectedUnit) {
            case UnitModel.PANEL:
              return `
               Location = ${panel.location} \r\n
               String: ${stringName} \r\n
              `
            case UnitModel.STRING:
              if (panel.stringId === selectedId) {
                if (selectedStringTooltip) {
                  return selectedStringTooltip
                }
              }
          }
        }
        return `
          Location = ${panel.location} \r\n
          String: ${stringName} \r\n
        `*/
  }

  onRightClick(event: MouseEvent, panel: PanelModel) {
    event.preventDefault()

    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.menuData = { panel }
    this.matMenuTrigger.openMenu()
  }

  selectString(panel: PanelModel) {
    this.store.dispatch(GridStateActions.changeGridmode({ mode: GridMode.SELECT }))
    this.store.dispatch(SelectedStateActions.selectType({ objectType: TypeModel.STRING }))
    this.store.dispatch(SelectedStateActions.selectString({ stringId: panel.stringId }))
  }

  editString(panel: PanelModel) {
    const dialogConfig = new MatDialogConfig()

    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true

    dialogConfig.data = {
      stringId: panel.stringId,
    }

    this.dialog.open(EditStringDialog, dialogConfig)
  }

  deletePanel(panel: PanelModel) {
    this.panelsEntity.delete(panel)
  }

  async panelAction(panel: PanelModel, shiftKey: boolean) {
    if (!panel) {
      return console.error('err panelAction !panel')
    }

    const gridMode = await firstValueFrom(this.store.select(selectGridMode))

    switch (gridMode) {
      case GridMode.LINK:
        break
      case GridMode.DELETE:
        this.panelsEntity.delete(panel)
        break
      case GridMode.SELECT:
        const isStringSelected = await firstValueFrom(this.isSelectedString$)
        if (isStringSelected) {
          console.log('s')
          this.store.dispatch(
            SelectedStateActions.selectPanelWhenStringSelected({ panelId: panel.id }),
          )
        } else {
          if (shiftKey) {
            this.store.dispatch(
              SelectedStateActions.addPanelToMultiselect({
                panelId: panel.id,
              }),
            )
          } else {
            this.store.dispatch(SelectedStateActions.selectPanel({ panelId: panel.id }))
          }
        }

        break
      case GridMode.CREATE:
        const createMode = await firstValueFrom(this.store.select(selectCreateMode))

        if (createMode === TypeModel.RAIL) {
          return
        } else {
          this.store.dispatch(GridStateActions.changeGridmode({ mode: GridMode.SELECT }))
          if (shiftKey) {
            this.store.dispatch(
              SelectedStateActions.addPanelToMultiselect({
                panelId: panel.id,
              }),
            )
          } else {
            this.store.dispatch(SelectedStateActions.selectPanel({ panelId: panel.id }))
          }
        }

        break
      case GridMode.MULTICREATE:
        break
      default:
        this.store.dispatch(GridStateActions.changeGridmode({ mode: GridMode.SELECT }))
        if (shiftKey) {
          this.store.dispatch(
            SelectedStateActions.addPanelToMultiselect({
              panelId: panel.id,
            }),
          )
        } else {
          this.store.dispatch(SelectedStateActions.selectPanel({ panelId: panel.id }))
        }

        break
    }
  }

  createNewStringWithSelected() {
    this.dialog.open(NewStringDialog)
  }

  addSelectedToExistingString() {
    this.dialog.open(ExistingStringsDialog)
  }

  deleteSelectedString(stringId: string) {
    firstValueFrom(
      this.store
        .select(selectSelectedState)
        .pipe(
          combineLatestWith(
            this.stringsEntity.entities$.pipe(
              map((strings) => strings.find((s) => s.id === stringId)),
            ),
          ),
        ),
    ).then(([selected, selectedString]) => {
      if (selected.type === TypeModel.STRING) {
        if (selected.singleSelectId === selectedString?.id) {
          this.stringsEntity.delete(selectedString!)
        }
      }
    })
  }

  rotatePanel(panel: PanelModel) {
    const update: Partial<PanelModel> = {
      ...panel,
      rotation: panel.rotation === 0 ? 1 : 0,
    }
    this.panelsEntity.update(update)
  }

  deletePanelLink(panel: PanelModel, linkId: string) {
    this.linksEntity.delete(linkId)
    firstValueFrom(
      this.store
        .select(selectSelectedStringId)
        .pipe(map((selectedId) => selectedId === panel.stringId)),
    ).then((isInSelectedString) => {
      if (isInSelectedString) {
        this.store.dispatch(SelectedStateActions.clearSelectedPanelLinks())
      }
    })
  }

  async rotateSelected(rotation: number) {
    const multiSelectIds = await firstValueFrom(this.store.select(selectMultiSelectIds))
    if (multiSelectIds) {
      const panelsToUpdate = await firstValueFrom(
        this.panelsEntity.entities$.pipe(
          map((panels) => panels.filter((panel) => multiSelectIds.includes(panel.id))),
          map((selectedPanels) =>
            selectedPanels.map((panel) => {
              return {
                ...panel,
                rotation,
              } as Partial<PanelModel>
            }),
          ),
        ),
      )

      this.panelsEntity.updateManyInCache(panelsToUpdate)
    }
  }

  removeFromString(panel: PanelModel) {
    const update: Partial<PanelModel> = {
      ...panel,
      stringId: 'undefined',
    }

    this.panelsEntity.update(update)
  }

  markPanelAsDisconnectionPoint(panel: PanelModel) {
    // const update = panel.markAsDisconnectionPoint()
  }

  getBackgroundColor(
    stringColor: string,
    pathMap: Map<string, { link: number; count: number; color: string }>,
    isInSelection: boolean,
    positiveTo: boolean,
    negativeTo: boolean,
    isPanelToJoin: boolean,
    isOtherStringSelected: boolean,
  ) {
    if (isOtherStringSelected) {
      return '#819CA9'
    }
    if (positiveTo) {
      return SoftColor.SoftRed
    }
    if (negativeTo) {
      return SoftColor.SoftCyan
    }
    if (isPanelToJoin) {
      return VibrantColor.VibrantPurple
    }
    if (pathMap) {
      const thisPanelPath = pathMap.get(this.id)
      if (thisPanelPath) {
        return thisPanelPath.color
      }
    }

    if (isInSelection) {
      // return '#ff1c24'
      // return '#00E6DF'
      // return VibrantColors.VibrantGreen
      // return `hwb(0 20% 0%)`
    }
    if (stringColor.length > 0) {
      // return `hwb(0 0% 20%)`
      // return DarkColors.SoftCyan
      // return DarkColors.Purple
      return stringColor
    } else {
    }
    return ''
  }

  getBoxShadow(
    stringColor: string,
    pathMap: Map<string, { link: number; count: number; color: string }>,
    isInSelection: boolean,
    isSelectedString: boolean,
  ) {
    /*    if (isInSelection && isSelectedString) {
      return `0 0 0 1px red, 0 0 0 0.5px ${DarkColor.SoftCyan}`
    }*/
    if (isInSelection) {
      // return `0 0 0 2px ${VibrantColors.VibrantOrange}`
      // return `0 0 0 2px ${DarkColors.SoftCyan}`
      // return `0 0 0 2px ${LightColors.LightBlue}`
      return `0 0 0 1px red`
      // return `0 0 0 1px red`
      // return `0 0 0 1px ${VibrantColors.VibrantGreen}`
      // border: 2px solid $borderColor;
      // return '#00E6DF'

      // return VibrantColors.VibrantGreen
      // return `hwb(0 20% 0%)`
    }
    if (isSelectedString) {
      // return `rgb(85, 91, 255) 0px 0px 0px 3px, rgb(31, 193, 27) 0px 0px 0px 6px, rgb(255, 217, 19) 0px 0px 0px 9px, rgb(255, 156, 85) 0px 0px 0px 12px, rgb(255, 85, 85) 0px 0px 0px 15px`
      // return `rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset`
      // return `0 0 0 0.5px ${DarkColor.SoftOrange}`
    }
    if (stringColor) {
      // return `0 0 0 1px ${stringColor}`
      // return `hwb(0 0% 20%)`
      // return stringColor
      // return
    }
    return ''
  }
}
