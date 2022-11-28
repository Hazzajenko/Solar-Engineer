import { SelectedState } from './../../../../store/selected/selected.reducer';
import { JoinsState } from './../../../../store/joins/joins.reducer'
import { ProjectModel } from './../../../../models/project.model'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core'
import { PanelModel } from '../../../../models/panel.model'
import { GridMode } from '../../../../store/grid/grid-mode.model'
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
import { PanelsEntityService } from '../../../services/panels-entity/panels-entity.service'
import { PanelJoinsEntityService } from '../../../services/panel-joins-entity/panel-joins-entity.service'
import { LetModule } from '@ngrx/component'
import { GetPanelJoinPipe } from '../../../../../pipes/get-panel-join.pipe'
import { PanelDirective } from '../../../../../directives/panel.directive'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { PanelLinkComponent } from '../../../../../components/panel-link/panel-link.component'
import { StringsEntityService } from '../../../services/strings-entity/strings-entity.service'
import { StatsService } from '../../../../services/stats.service'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { BlockMenuComponent } from '../block-switch/block-menu/block-menu.component'
import { RightClick } from '../block-switch/right-click'
import { SelectedModel } from '../../../../models/selected.model'
import { UnitModel } from '../../../../models/unit.model'
import { StringModel } from '../../../../models/string.model'
import { LoggerService } from '../../../../../services/logger.service'
import { PanelLinkModel } from '../../../../models/panel-link.model'
import { GridStateActions } from '../../../../store/grid/grid.actions'
import { SelectedStateActions } from '../../../../store/selected/selected.actions'
import { ThisReceiver } from '@angular/compiler'
import { GridJoinService } from 'src/app/projects/services/grid/grid-join.service'
import { JoinsService } from 'src/app/projects/services/joins.service'

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
export class BlockPanelComponent implements OnInit, AfterViewInit {
  // @ViewChild('outlet', { read: ViewContainerRef }) outletRef!: ViewContainerRef
  // @ViewChild('content', { read: TemplateRef }) contentRef!: TemplateRef<any>
  @ViewChild('panelDiv') panelDiv!: ElementRef
  @Input() project?: ProjectModel
  @Input() panel?: PanelModel
  @Input() selected?: SelectedState
  @Input() gridMode?: GridMode
  @Input() panelString?: StringModel
  @Input() joinsState?: JoinsState
  // @Input() panelsForString?: PanelModel[]
  // @Input() panelLink?: PanelLinkModel
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  @Output() rightClickPanel = new EventEmitter<RightClick>()
  panelClass: string = 'drop-zone__bg-default'

  constructor(
    public panelsEntity: PanelsEntityService,
    public panelJoinsEntity: PanelJoinsEntityService,
    public stringsEntity: StringsEntityService,
    private joinsService: JoinsService,
    // private elRef: ElementRef,
    public store: Store<AppState>,
    private statsService: StatsService,
    private logger: LoggerService,
    private cdr: ChangeDetectorRef,
  ) {}

  displayTooltip(panel: PanelModel): string {
    if (this.selected) {
      switch (this.selected.unit) {
        case UnitModel.PANEL:
          return `
           Location = ${panel.location} \r\n
           String: ${panel.string_id} \r\n
          `
        case UnitModel.STRING:
          if (!this.panelString) {
            this.logger.error('err displayTooltip panelString')
            return 'err displayTooltip panelString'
          }
          // if (!this.panelsForString) {
          //   this.logger.error('err displayTooltip panelString')
          //   return 'err displayTooltip panelString'
          // }

          if (this.panelString.id === this.selected.singleSelectId) {
            // const stringStats = this.statsService.calculateStringTotals(
            //   this.panelString,
            //   this.panelsForString,
            // )

            //  Panels: ${this.panelsForString.length} \r\n
            //  TotalVoc: ${stringStats.totalVoc}V \r\n
            //  TotalVmp: ${stringStats.totalVmp}V \r\n
            //  TotalPmax: ${stringStats.totalPmax}W \r\n
            //  TotalIsc: ${stringStats.totalIsc}A \r\n

            return `
           String = ${this.panelString.name} \r\n
           Color: ${this.panelString.color} \r\n
           Parallel: ${this.panelString.is_in_parallel} \r\n
        `
          }
      }
    }
    return `
       Location = ${panel.location} \r\n
       String: ${panel.string_id} \r\n
    `
  }

  ngOnInit() {}

  onRightClick(event: MouseEvent, panel: PanelModel) {
    event.preventDefault()
    this.rightClickPanel.emit({ event, item: panel })
  }

  clickPanel(panel: PanelModel) {
    if (!panel || !this.gridMode || !this.project) return

    switch (this.gridMode) {
      case GridMode.JOIN:
        if (this.joinsState) {
          console.log('click joins true')
          this.joinsService.addPanelToJoin(this.project, panel, this.joinsState)
        }
        console.log('click joins')
        break
      case GridMode.DELETE:
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
    }

    // if (this.gridMode === GridMode.JOIN || this.gridMode == GridMode.DELETE) {
    //   return
    // } else {
    //   if (this.gridMode !== GridMode.SELECT) {
    //     this.store.dispatch(
    //       GridStateActions.changeGridmode({ mode: GridMode.SELECT }),
    //     )
    //   }
    //   this.store.dispatch(
    //     SelectedStateActions.selectPanel({ panelId: panel.id }),
    //   )
    // if (this.selected?.multiSelect) {
    //   this.store.dispatch(
    //     SelectedStateActions.toggleMultiSelect({ multiSelect: false }),
    //   )
    // }

    // this.store.dispatch(
    //   SelectedStateActions.selectUnit({ unit: UnitModel.PANEL }),
    // )
    // this.store.dispatch(SelectedStateActions.selectId({ id: panel.id }))

    // this.panelClass = 'drop-zone__bg-selected'
    // }
  }

  ngAfterViewInit(): void {
    if (this.selected && this.panel) {
      if (this.selected.unit === UnitModel.PANEL) {
        if (!this.selected.multiSelect) {
          if (this.selected.singleSelectId === this.panel.id) {
            this.panelDiv.nativeElement.style.backgroundColor = '#07ffd4'
          } else {
            this.panelDiv.nativeElement.style.backgroundColor = '#9ec7f9'
          }
        }
      }
    }

    /*    this.sub = combineLatest([
          this.selected$,
          this.store.select(selectBlockToJoin),
          this.panelsEntity.entities$,
          this.store.select(selectGridMode),
          this.selectedLinks$,
        ]).subscribe(([selected, blockToJoin, panels, gridMode, selectedLinks]) => {
          this.gridMode = gridMode

          if (selected?.selectedPanels?.includes(<PanelModel>this.panel)) {
            this.panelDiv.nativeElement.style.backgroundColor = '#07ffd4'
          } else {
            this.panelDiv.nativeElement.style.backgroundColor = '#9ec7f9'
          }

          /!*      if (selected?.selectedPanels?.length === 0) {
                  this.selectedPositiveLinkTo = undefined
                  this.selectedNegativeLinkTo = undefined
                }*!/

          if (gridMode === GridMode.SELECT) {
            if (
              selectedLinks?.selectedPositiveLinkTo &&
              selectedLinks?.selectedPositiveLinkTo === this.panel?.id
            ) {
              this.panelDiv.nativeElement.style.backgroundColor = '#b595f9'
            }

            if (
              selectedLinks?.selectedNegativeLinkTo &&
              selectedLinks?.selectedNegativeLinkTo === this.panel?.id
            ) {
              this.panelDiv.nativeElement.style.backgroundColor = '#38c1ff'
            }

            if (
              selected?.selectedStrings &&
              selected.selectedStrings?.length === 1 &&
              selected.selectedStrings[0] != undefined
            ) {
              const stringPanels = panels?.filter(
                (p) => p.string_id === selected!.selectedStrings![0],
              )
              console.log(
                'selected!.selectedStrings![0]',
                selected!.selectedStrings![0],
              )
              console.log('stringPanels', stringPanels)
              if (stringPanels?.includes(<PanelModel>this.panel)) {
                this.panelDiv.nativeElement.style.backgroundColor = '#07ffd4'
              } else {
                this.panelDiv.nativeElement.style.backgroundColor = '#9ec7f9'
              }
            }
          }
          if (gridMode === GridMode.JOIN) {
            if (blockToJoin?.id === this.panel?.id) {
              this.panelDiv.nativeElement.style.backgroundColor = '#ff00d6'
            }
          }
        })*/
  }

  // private rerender() {
  //   this.outletRef.clear()
  //   this.outletRef.createEmbeddedView(this.contentRef)
  // }
}
