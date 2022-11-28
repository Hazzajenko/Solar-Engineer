import { SelectedState } from './../../../../store/selected/selected.reducer'
import { ProjectModel } from './../../../../models/project.model'
import { JoinsState } from './../../../../store/joins/joins.reducer'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { InverterModel } from '../../../../models/inverter.model'
import { PanelModel } from '../../../../models/panel.model'
import { CableModel } from '../../../../models/cable.model'
import { InvertersEntityService } from '../../../services/inverters-entity/inverters-entity.service'
import { PanelsEntityService } from '../../../services/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../../services/cables-entity/cables-entity.service'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { GridMode } from '../../../../store/grid/grid-mode.model'
import { BlockModel } from '../../../../models/block.model'
import { BlockInverterComponent } from '../block-inverter/block-inverter.component'
import { BlockPanelComponent } from '../block-panel/block-panel.component'
import { BlockCableComponent } from '../block-cable/block-cable.component'
import { BlockDisconnectionPointComponent } from '../../block-disconnection-point/block-disconnection-point.component'
import { GridStateActions } from '../../../../store/grid/grid.actions'
import { UnitModel } from '../../../../models/unit.model'
import { SelectedStateActions } from '../../../../store/selected/selected.actions'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { DisconnectionPointModel } from '../../../../models/disconnection-point.model'
import { DisconnectionPointsEntityService } from '../../../services/disconnection-points-entity/disconnection-points-entity.service'
import { GridDeleteService } from '../../../../services/grid/grid-delete.service'
import { BlockMenuComponent } from './block-menu/block-menu.component'
import { RightClick } from './right-click'
import { StringModel } from '../../../../models/string.model'
import { LoggerService } from '../../../../../services/logger.service'
import { SelectedModel } from '../../../../models/selected.model'
import { LetModule } from '@ngrx/component'
import { PanelJoinModel } from '../../../../models/panel-join.model'
import { PanelLinkModel } from '../../../../models/panel-link.model'
import { GetPanelStringPipe } from './get-panel-string.pipe'
import { GetSelectedLinksPipe } from './get-selected-links.pipe'
import { GetPanelPipe } from './get-panel.pipe'
import { GetCablePipe } from './get-cable.pipe'
import { GetDisconnectionPointPipe } from './get-disconnection-point.pipe'
import { GetInverterPipe } from './get-inverter.pipe'

@Component({
  selector: 'app-block-switch',
  standalone: true,
  imports: [
    CommonModule,
    BlockInverterComponent,
    BlockPanelComponent,
    BlockCableComponent,
    BlockDisconnectionPointComponent,
    MatMenuModule,
    BlockMenuComponent,
    LetModule,
    GetPanelStringPipe,
    GetSelectedLinksPipe,
    GetPanelPipe,
    GetCablePipe,
    GetDisconnectionPointPipe,
    GetInverterPipe,
  ],
  templateUrl: './block-switch.component.html',
  styleUrls: ['./block-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockSwitchComponent {
  @Input() project!: ProjectModel
  @Input() gridMode!: GridMode
  @Input() block?: BlockModel
  @Input() inverters?: InverterModel[]
  @Input() strings?: StringModel[]
  @Input() panels?: PanelModel[]
  @Input() disconnectionPoints?: DisconnectionPointModel[]
  @Input() cables?: CableModel[]
  @Input() selected?: SelectedState
  @Input() joins?: JoinsState

  // @Input() panelJoins?: PanelJoinModel[]
  // @ContentChild(BlockPanelComponent) blockPanel!: BlockPanelComponent
  /*  @ViewChild(BlockPanelComponent, { static: false })
    blockPanel!: BlockPanelComponent*/
  // @ViewChildren(BlockPanelComponent)
  // blockPanels!: QueryList<BlockPanelComponent>
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  // _reload: boolean = true
  panelLink?: PanelLinkModel

  constructor(
    private invertersEntity: InvertersEntityService,
    private panelsEntity: PanelsEntityService,
    public cablesEntity: CablesEntityService,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
    private store: Store<AppState>,
    public gridDelete: GridDeleteService,
    private logger: LoggerService,
  ) {}

  // getPanelByLocation(location: string): PanelModel | undefined {
  //   if (!this.panels) {
  //     this.logger.error('err getPanelByLocation')
  //     return undefined
  //   }
  //   return this.panels.find((panel) => panel.location === location)
  // }

  // getStringForPanel(panel?: PanelModel): StringModel | undefined {
  //   if (!this.strings || !panel) {
  //     this.logger.error('err getPanelByLocation')
  //     return undefined
  //   }
  //   const panelString = this.strings.find(
  //     (string) => string.id === panel.string_id,
  //   )
  //   if (!panelString) {
  //     this.logger.error('err getPanelByLocation')
  //     return undefined
  //   }
  //   return panelString
  // }

  // getPanelsForString(string: StringModel): PanelModel[] | undefined {
  //   if (!string || !this.panels) {
  //     this.logger.error('err getPanelsForString')
  //     return undefined
  //   }
  //   const panelsForString = this.panels.filter(
  //     (panel) => panel.string_id === string.id,
  //   )
  //   if (!panelsForString) {
  //     this.logger.error('err getPanelsForString')
  //     return undefined
  //   }
  //   return panelsForString
  // }

  // initSelectedPanelLinks() {
  //   if (this.selected) {
  //     switch (this.selected.unit) {
  //       case UnitModel.PANEL:
  //         if (this.panelJoins) {
  //           const positive = this.panelJoins.find(
  //             (pJoin) => pJoin.negative_id === this.selected?.singleSelectId,
  //           )?.positive_id
  //           const negative = this.panelJoins.find(
  //             (pJoin) => pJoin.positive_id === this.selected?.singleSelectId,
  //           )?.negative_id
  //           this.panelLink = {
  //             selectedPositiveLinkTo: positive,
  //             selectedNegativeLinkTo: negative,
  //           } as PanelLinkModel
  //         }
  //         break
  //       case UnitModel.DISCONNECTIONPOINT:
  //         if (this.panelJoins) {
  //           const positive = this.panelJoins.find(
  //             (pJoin) => pJoin.negative_id === this.selected?.singleSelectId,
  //           )?.positive_id
  //           const negative = this.panelJoins.find(
  //             (pJoin) => pJoin.positive_id === this.selected?.singleSelectId,
  //           )?.negative_id
  //           this.panelLink = {
  //             selectedPositiveLinkTo: positive,
  //             selectedNegativeLinkTo: negative,
  //           } as PanelLinkModel
  //         }
  //         break
  //     }
  //   }
  //   return (this.panelLink = {
  //     selectedPositiveLinkTo: undefined,
  //     selectedNegativeLinkTo: undefined,
  //   } as PanelLinkModel)
  // }

  // getSelectedPanelLinks(): PanelLinkModel | undefined {
  //   if (this.selected) {
  //     switch (this.selected.unit) {
  //       case UnitModel.PANEL:
  //         if (this.panelJoins) {
  //           const positive = this.panelJoins.find(
  //             (pJoin) => pJoin.negative_id === this.selected?.singleSelectId,
  //           )?.positive_id
  //           const negative = this.panelJoins.find(
  //             (pJoin) => pJoin.positive_id === this.selected?.singleSelectId,
  //           )?.negative_id
  //           return {
  //             selectedPositiveLinkTo: positive,
  //             selectedNegativeLinkTo: negative,
  //           } as PanelLinkModel
  //         }
  //         break
  //       case UnitModel.DISCONNECTIONPOINT:
  //         if (this.panelJoins) {
  //           const positive = this.panelJoins.find(
  //             (pJoin) => pJoin.negative_id === this.selected?.singleSelectId,
  //           )?.positive_id
  //           const negative = this.panelJoins.find(
  //             (pJoin) => pJoin.positive_id === this.selected?.singleSelectId,
  //           )?.negative_id
  //           return {
  //             selectedPositiveLinkTo: positive,
  //             selectedNegativeLinkTo: negative,
  //           } as PanelLinkModel
  //         }
  //         break
  //     }
  //   }
  //   return undefined
  // }

  // getCableByLocation(location: string): CableModel | undefined {
  //   if (!this.cables) {
  //     this.logger.error('err getCableByLocation')
  //     return undefined
  //   }
  //   return this.cables.find((cable) => cable.location === location)
  // }

  // getDisconnectionPointByLocation(
  //   location: string,
  // ): DisconnectionPointModel | undefined {
  //   if (!this.disconnectionPoints) {
  //     this.logger.error('err getDisconnectionPointByLocation')
  //     return undefined
  //   }
  //   return this.disconnectionPoints.find((dp) => dp.location === location)
  // }

  // getInverterByLocation(location: string): InverterModel | undefined {
  //   if (!this.inverters) {
  //     this.logger.error('err getInverterByLocation')
  //     return undefined
  //   }
  //   return this.inverters.find((inverter) => inverter.location === location)
  // }

  // selectBlock(block: any) {
  //   if (!block || !this.gridMode) return
  //   if (this.gridMode === GridMode.JOIN || this.gridMode == GridMode.DELETE) {
  //     return
  //   } else {
  //     if (this.gridMode !== GridMode.SELECT) {
  //       this.store.dispatch(
  //         GridStateActions.changeGridmode({ mode: GridMode.SELECT }),
  //       )
  //     }
  //     if (this.selected?.multiSelect) {
  //       this.store.dispatch(
  //         SelectedStateActions.toggleMultiSelect({ multiSelect: false }),
  //       )
  //     }

  //     switch (block.model) {
  //       case UnitModel.INVERTER:
  //         return
  //       case UnitModel.PANEL:
  //         return
  //       /*          this.store.dispatch(
  //                   SelectedStateActions.selectUnit({ unit: UnitModel.PANEL }),
  //                 )
  //                 return this.store.dispatch(
  //                   SelectedStateActions.selectId({ id: block.id }),
  //                 )*/
  //       case UnitModel.CABLE:
  //         return
  //       case UnitModel.DISCONNECTIONPOINT:
  //         this.store.dispatch(
  //           SelectedStateActions.selectUnit({
  //             unit: UnitModel.DISCONNECTIONPOINT,
  //           }),
  //         )
  //         return this.store.dispatch(
  //           SelectedStateActions.selectId({
  //             id: block.id,
  //           }),
  //         )
  //       default:
  //         break
  //     }
  //     return
  //   }
  // }

  onRightClickEvent(event: RightClick) {
    this.menuTopLeftPosition.x = event.event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.event.clientY + 10 + 'px'
    this.matMenuTrigger.menuData = { item: event.item }
    this.matMenuTrigger.openMenu()
  }

  // private reload() {
  //   setTimeout(() => (this._reload = false))
  //   setTimeout(() => (this._reload = true))
  // }
}
