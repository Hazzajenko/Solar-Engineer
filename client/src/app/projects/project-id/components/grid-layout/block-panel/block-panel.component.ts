import { Component, ElementRef, Input, OnInit } from '@angular/core'
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
import { selectSelectedPanels } from '../../../../store/selected/selected.selectors'
import { combineLatest } from 'rxjs'

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
  ],
  standalone: true,
})
export class BlockPanelComponent implements OnInit {
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

  constructor(
    public panelsEntity: PanelsEntityService,
    public panelJoinsEntity: PanelJoinsEntityService,
    private elRef: ElementRef,
    public store: Store<AppState>,
  ) {}

  panelHover(panel: PanelModel) {
    // this.elRef.nativeElement.style.backgroundColor = '#e014ce'
  }

  ngOnInit(): void {
    this.store.select(selectSelectedPanels).subscribe((panels) => {
      if (panels?.includes(<PanelModel>this.panel)) {
        this.elRef.nativeElement.style.backgroundColor = '#07ffd4'
      } else {
        this.elRef.nativeElement.style.backgroundColor = '#9ec7f9'
      }
      this.panelJoinsEntity.entities$
    })

    combineLatest([
      this.store.select(selectSelectedPanels),
      this.panelJoinsEntity.entities$,
    ]).subscribe(([panels, panelJoins]) => {
      if (panels?.includes(<PanelModel>this.panel)) {
        this.elRef.nativeElement.style.backgroundColor = '#07ffd4'
      } else {
        this.elRef.nativeElement.style.backgroundColor = '#9ec7f9'
      }

      const link = panelJoins.find(pJoin => pJoin.positive_id === )
    })
  }
}
