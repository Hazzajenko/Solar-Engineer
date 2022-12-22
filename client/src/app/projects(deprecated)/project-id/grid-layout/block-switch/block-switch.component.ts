import { SelectedState } from '../../services/store/selected/selected.reducer'
import { ProjectModel } from '../../../../shared/models/projects/project.model'
import { LinksState } from '../../services/store/links/links.reducer'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { InverterModel } from '../../../models/deprecated-for-now/inverter.model'
import { PanelModel } from '../../../models/panel.model'
import { CableModel } from '../../../models/deprecated-for-now/cable.model'
import { InvertersEntityService } from '../../services/ngrx-data/inverters-entity/inverters-entity.service'
import { PanelsEntityService } from '../../services/ngrx-data/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../services/ngrx-data/cables-entity/cables-entity.service'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { GridMode } from '../../services/store/grid/grid-mode.model'
import { BlockModel } from '../../../models/block.model'
import { BlockInverterComponent } from './block-inverter/block-inverter.component'
import { BlockPanelComponent } from './block-panel/block-panel.component'
import { BlockCableComponent } from './block-cable/block-cable.component'
import { BlockDisconnectionPointComponent } from './block-disconnection-point/block-disconnection-point.component'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { DisconnectionPointModel } from '../../../models/disconnection-point.model'
import { DisconnectionPointsEntityService } from '../../services/ngrx-data/disconnection-points-entity/disconnection-points-entity.service'
import { BlockMenuComponent } from './block-menu/block-menu.component'
import { RightClick } from './right-click'
import { StringModel } from '../../../models/string.model'
import { LetModule } from '@ngrx/component'
import { PanelLinksToModel } from '../../../models/deprecated-for-now/panel-links-to.model'
import { BlockTrayComponent } from './block-tray/block-tray.component'
import { BlockRailComponent } from './block-rail/block-rail.component'

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
    BlockTrayComponent,
    BlockRailComponent,
  ],
  templateUrl: './block-switch.component.html',
  styleUrls: ['./block-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockSwitchComponent implements AfterViewInit {
  @Input() project!: ProjectModel
  @Input() gridMode!: GridMode
  @Input() block?: BlockModel
  @Input() inverters?: InverterModel[]
  @Input() strings?: StringModel[]
  @Input() panels?: PanelModel[]
  @Input() disconnectionPoints?: DisconnectionPointModel[]
  @Input() cables?: CableModel[]
  @Input() selected?: SelectedState
  @Input() joins?: LinksState

  // @Input() panelJoins?: PanelJoinModel[]
  // @ContentChild(BlockRailComponent) blockPanel!: BlockRailComponent
  /*  @ViewChild(BlockRailComponent, { static: false })
    blockPanel!: BlockRailComponent*/
  // @ViewChildren(BlockRailComponent)
  // blockPanels!: QueryList<BlockRailComponent>
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  // _reload: boolean = true
  panelLink?: PanelLinksToModel

  constructor(
    private invertersEntity: InvertersEntityService,
    private panelsEntity: PanelsEntityService,
    public cablesEntity: CablesEntityService,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
    private store: Store<AppState>,
    private elRef: ElementRef,
  ) {}

  ngAfterViewInit() {
/*    console.log(this.elRef.nativeElement.offsetLeft, this.elRef.nativeElement.offsetTop)
    let offsetLeft = 0
    let offsetTop = 0

    let el = this.elRef.nativeElement

    while (el) {
      offsetLeft += el.offsetLeft
      offsetTop += el.offsetTop
      el = el.parentElement
    }
    console.log(offsetTop, offsetLeft)
    const block: BlockModel = {
      id: this.block?.id!,
      location: this.block?.location!,
      model: this.block?.model!,
      x: el!.offsetLeft,
      y: el!.offsetTop,
    }
    this.store(deprecated).dispatch(BlocksStateActions.updateBlockForGrid({ block }))*/
  }

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
  //       this.store(deprecated).dispatch(
  //         GridStateActions.changeGridmode({ mode: GridMode.SELECT }),
  //       )
  //     }
  //     if (this.selected?.multiSelect) {
  //       this.store(deprecated).dispatch(
  //         SelectedStateActions.toggleMultiSelect({ multiSelect: false }),
  //       )
  //     }

  //     switch (block.model) {
  //       case UnitModel.INVERTER:
  //         return
  //       case UnitModel.PANEL:
  //         return
  //       /*          this.store(deprecated).dispatch(
  //                   SelectedStateActions.selectUnit({ unit: UnitModel.PANEL }),
  //                 )
  //                 return this.store(deprecated).dispatch(
  //                   SelectedStateActions.selectId({ id: block.id }),
  //                 )*/
  //       case UnitModel.CABLE:
  //         return
  //       case UnitModel.DISCONNECTIONPOINT:
  //         this.store(deprecated).dispatch(
  //           SelectedStateActions.selectUnit({
  //             unit: UnitModel.DISCONNECTIONPOINT,
  //           }),
  //         )
  //         return this.store(deprecated).dispatch(
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
