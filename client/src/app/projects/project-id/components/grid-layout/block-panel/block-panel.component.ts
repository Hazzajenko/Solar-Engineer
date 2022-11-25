import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core'
import { PanelModel } from '../../../../models/panel.model'
import { BlockModel } from '../../../../models/block.model'
import { UnitModel } from '../../../../models/unit.model'
import { StringModel } from '../../../../models/string.model'
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
  selectSelectedPanels,
  selectSelectedStrings,
  selectUnitSelected,
} from '../../../../store/selected/selected.selectors'
import { combineLatest, Observable } from 'rxjs'
import { PanelLinkComponent } from '../../../../../components/panel-link/panel-link.component'
import { selectPanelToJoin } from '../../../../store/joins/joins.selectors'
import { selectGridMode } from '../../../../store/grid/grid.selectors'
import { map } from 'rxjs/operators'
import { StringsEntityService } from '../../../services/strings-entity/strings-entity.service'

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
  @Input() panels?: PanelModel[]
  @Input() block?: BlockModel
  @Input() panel?: PanelModel
  @Input() grid?: {
    createMode?: UnitModel
    selectedStrings?: StringModel[]
    selectedString?: StringModel
    gridMode?: GridMode
  }
  @Input() toJoinArray?: string[]
  @Input() panelToJoin?: PanelModel[]
  @Input() selected?: {
    unit?: UnitModel
    panel?: PanelModel
    panels?: PanelModel[]
  }
  selectedPositiveLinkTo?: string
  selectedPositiveLinkTo$?: Observable<string | undefined>
  selectedNegativeLinkTo?: string

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
    ]).subscribe(([unit, strings, panels]) => {
      switch (unit) {
        case UnitModel.PANEL:
          tooltip = `
       Location = ${panel.location} \r\n
       String: ${panel.string_id} \r\n
    `
          break
        case UnitModel.STRING:
          const panelsInString = panels.filter(
            (s) => s.string_id === panel.string_id,
          )
          const panelString = strings.find((s) => s.id === panel.string_id)
          tooltip = `
       String = ${panelString?.name} \r\n
       Color: ${panelString?.color} \r\n
       Parallel: ${panelString?.is_in_parallel} \r\n
       Panels: ${panelsInString?.length} \r\n
    `
          break
      }
    })

    return tooltip
  }

  ngOnInit() {
    this.selectedLinks$ = combineLatest([
      this.store.select(selectSelectedPanels),
      this.panelJoinsEntity.entities$,
    ]).pipe(
      map(([panels, panelJoins]) => {
        if (!panels) return
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
      }),
    )
    this.selected$ = combineLatest([
      this.store.select(selectUnitSelected),
      this.store.select(selectSelectedStrings),
      this.store.select(selectSelectedPanels),
      this.panelsEntity.entities$,
    ]).pipe(
      map(([selectedUnit, selectedStrings, selectedPanels, panels]) => ({
        selectedUnit,
        selectedStrings,
        selectedPanels,
        panels,
      })),
    )
  }

  ngAfterViewInit(): void {
    combineLatest([
      this.selected$,
      this.store.select(selectPanelToJoin),
      this.panelsEntity.entities$,
      this.store.select(selectGridMode),
      this.selectedLinks$,
    ]).subscribe(([selected, panelToJoin, panels, gridMode, selectedLinks]) => {
      this.gridMode = gridMode

      if (selected?.selectedPanels?.includes(<PanelModel>this.panel)) {
        this.panelDiv.nativeElement.style.backgroundColor = '#07ffd4'
      } else {
        this.panelDiv.nativeElement.style.backgroundColor = '#9ec7f9'
      }

      if (selected?.selectedPanels?.length === 0) {
        this.selectedPositiveLinkTo = undefined
        this.selectedNegativeLinkTo = undefined
      }

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
        if (panelToJoin?.id === this.panel?.id) {
          this.panelDiv.nativeElement.style.backgroundColor = '#ff00d6'
        }
      }
    })
  }
}
