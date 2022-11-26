import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core'
import { PanelModel } from '../../../../models/panel.model'
import { UnitModel } from '../../../../models/unit.model'
import { GridMode } from '../../../../store/grid/grid-mode.model'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatTooltipModule } from '@angular/material/tooltip'
import { AsyncPipe, NgIf, NgStyle } from '@angular/common'
import { FindPanelLocationPipe } from '../../../../../pipes/find-panel-location.pipe'
import { PanelsEntityService } from '../../../services/panels-entity/panels-entity.service'
import { PanelJoinsEntityService } from '../../../services/panel-joins-entity/panel-joins-entity.service'
import { LetModule } from '@ngrx/component'
import { GetPanelJoinPipe } from '../../../../../pipes/get-panel-join.pipe'
import { PanelDirective } from '../../../../../directives/panel.directive'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import {
  selectSelectedDisconnectionPoint,
  selectSelectedPanels,
  selectSelectedStrings,
  selectUnitSelected,
} from '../../../../store/selected/selected.selectors'
import { combineLatest, Observable } from 'rxjs'
import { PanelLinkComponent } from '../../../../../components/panel-link/panel-link.component'
import { selectBlockToJoin } from '../../../../store/joins/joins.selectors'
import { selectGridMode } from '../../../../store/grid/grid.selectors'
import { map } from 'rxjs/operators'
import { StringsEntityService } from '../../../services/strings-entity/strings-entity.service'
import { StatsService } from '../../../../services/stats.service'

@Component({
  selector: 'app-block-panel',
  templateUrl: './block-panel.component.html',
  styleUrls: ['./block-panel.component.scss'],
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
  ],
  standalone: true,
})
export class BlockPanelComponent implements OnInit, AfterViewInit {
  @ViewChild('panelDiv') panelDiv!: ElementRef
  @Input() panel?: PanelModel

  selectedLinks$!: Observable<
    | {
        selectedPositiveLinkTo?: string
        selectedNegativeLinkTo?: string
      }
    | undefined
  >

  selected$!: Observable<
    | {
        selectedUnit?: UnitModel
        selectedStrings?: string[]
        selectedPanels?: PanelModel[]
        selectDisconnectionPoint?: string
        panels?: PanelModel[]
      }
    | undefined
  >
  selectedV2$!: Observable<
    | {
        selectedUnit?: UnitModel
        selectedStrings?: string[]
        selectedPanels?: PanelModel[]
        selectDisconnectionPoint?: string
        panels?: PanelModel[]
      }
    | undefined
  >

  gridMode?: GridMode
  tooltip?: string

  constructor(
    public panelsEntity: PanelsEntityService,
    public panelJoinsEntity: PanelJoinsEntityService,
    public stringsEntity: StringsEntityService,
    // private elRef: ElementRef,
    public store: Store<AppState>,
    private statsService: StatsService,
  ) {}

  panelHover(panel: PanelModel) {
    // this.panelDiv.nativeElement.style.backgroundColor = '#e014ce'
  }

  displayTooltip(panel: PanelModel): string {
    let tooltip: string = `
       Location = ${panel.location} \r\n
       String: ${panel.string_id} \r\n
    `
    combineLatest([
      this.store.select(selectUnitSelected),
      this.stringsEntity.entities$,
      this.panelsEntity.entities$,
      this.selected$,
    ]).subscribe(([unit, strings, panels, selected]) => {
      switch (unit) {
        case UnitModel.PANEL:
          tooltip = `
       Location = ${panel.location} \r\n
       String: ${panel.string_id} \r\n
    `
          break
        case UnitModel.STRING:
          if (selected?.selectedStrings) {
            if (selected.selectedStrings[0] === panel.string_id) {
              const panelsInString = panels.filter(
                (s) => s.string_id === panel.string_id,
              )
              const panelString = strings.find((s) => s.id === panel.string_id)
              if (!panelString) console.log('panel string error')
              const stringStats = this.statsService.calculateStringTotals(
                panelString!,
                panelsInString,
              )
              tooltip = `
       String = ${panelString?.name} \r\n
       Color: ${panelString?.color} \r\n
       Parallel: ${panelString?.is_in_parallel} \r\n
       Panels: ${panelsInString?.length} \r\n
       TotalVoc: ${stringStats.totalVoc}V \r\n
       TotalVmp: ${stringStats.totalVmp}V \r\n
       TotalPmax: ${stringStats.totalPmax}W \r\n
       TotalIsc: ${stringStats.totalIsc}A \r\n
    `
            }
          }

          break
      }
    })

    return tooltip
  }

  ngOnInit() {
    this.selectedLinks$ = combineLatest([
      this.store.select(selectUnitSelected),
      this.store.select(selectSelectedPanels),
      this.store.select(selectSelectedDisconnectionPoint),
      this.panelJoinsEntity.entities$,
    ]).pipe(
      map(([unit, panels, dps, panelJoins]) => {
        if (!panels) return
        if (unit === UnitModel.PANEL) {
          console.log('unit == PANEL')
          const panel = panels[0]
          const positive = panelJoins.find(
            (pJoin) => pJoin.negative_id === panel.id,
          )?.positive_id
          const negative = panelJoins.find(
            (pJoin) => pJoin.positive_id === panel.id,
          )?.negative_id
          return {
            selectedPositiveLinkTo: positive,
            selectedNegativeLinkTo: negative,
          }
        }
        if (!dps) return
        if (unit === UnitModel.DISCONNECTIONPOINT) {
          console.log('unit == dp')

          const dp = dps
          const positive = panelJoins.find(
            (pJoin) => pJoin.negative_id === dp,
          )?.positive_id
          const negative = panelJoins.find(
            (pJoin) => pJoin.positive_id === dp,
          )?.negative_id
          console.log('positive', positive)
          console.log('negative', negative)
          return {
            selectedPositiveLinkTo: positive,
            selectedNegativeLinkTo: negative,
          }
        }
        return
        /*        const panel = panels[0]
                const positive = panelJoins.find(
                  (pJoin) => pJoin.negative_id === panel.id,
                )?.positive_id
                const negative = panelJoins.find(
                  (pJoin) => pJoin.positive_id === panel.id,
                )?.negative_id
                return {
                  selectedPositiveLinkTo: positive,
                  selectedNegativeLinkTo: negative,
                }*/
      }),
    )
    this.selected$ = combineLatest([
      this.store.select(selectUnitSelected),
      this.store.select(selectSelectedStrings),
      this.store.select(selectSelectedPanels),
      this.store.select(selectSelectedDisconnectionPoint),
      this.panelsEntity.entities$,
    ]).pipe(
      map(([selectedUnit, selectedStrings, selectedPanels, dps, panels]) => ({
        selectedUnit,
        selectedStrings,
        selectedPanels,
        dps,
        panels,
      })),
    )
  }

  ngAfterViewInit(): void {
    combineLatest([
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

      /*      if (selected?.selectedPanels?.length === 0) {
              this.selectedPositiveLinkTo = undefined
              this.selectedNegativeLinkTo = undefined
            }*/

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
    })
  }
}
