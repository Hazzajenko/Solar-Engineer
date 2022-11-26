import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatTooltipModule } from '@angular/material/tooltip'
import { AsyncPipe, NgIf, NgStyle } from '@angular/common'
import { LetModule } from '@ngrx/component'
import { DisconnectionPointModel } from '../../../models/disconnection-point.model'
import { DisconnectionPointsEntityService } from '../../services/disconnection-points-entity/disconnection-points-entity.service'
import { combineLatest, Observable } from 'rxjs'
import {
  selectSelectedDisconnectionPoint,
  selectUnitSelected,
} from '../../../store/selected/selected.selectors'
import { map } from 'rxjs/operators'
import { UnitModel } from '../../../models/unit.model'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'

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
  ],
  standalone: true,
})
export class BlockDisconnectionPointComponent implements OnInit, AfterViewInit {
  @ViewChild('disconnectionPointDiv') disconnectionPointDiv!: ElementRef
  @Input() disconnectionPoint?: DisconnectionPointModel
  selected$!: Observable<
    | {
        selectedUnit?: UnitModel
        selectedDisconnectionPoint?: string
      }
    | undefined
  >
  selectedLinks$!: Observable<
    | {
        selectedPositiveLinkTo?: string
        selectedNegativeLinkTo?: string
      }
    | undefined
  >

  tooltip?: string

  constructor(
    public disconnectionPointsEntity: DisconnectionPointsEntityService,
    private store: Store<AppState>,
  ) {}

  displayTooltip(disconnectionPoint: DisconnectionPointModel): string {
    return `
       Location = ${disconnectionPoint.location} \r\n
       String: ${disconnectionPoint.string_id} \r\n
    `
  }

  ngOnInit() {
    this.selected$ = combineLatest([
      this.store.select(selectUnitSelected),
      this.store.select(selectSelectedDisconnectionPoint),
    ]).pipe(
      map(([selectedUnit, selectedDisconnectionPoint]) => ({
        selectedUnit,
        selectedDisconnectionPoint,
      })),
    )
    /*    this.selectedLinks$ = combineLatest([
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
        )*/
  }

  ngAfterViewInit(): void {
    combineLatest([this.selected$]).subscribe(([selected]) => {
      if (selected?.selectedUnit === UnitModel.DISCONNECTIONPOINT) {
        console.log(selected?.selectedDisconnectionPoint)
        if (selected?.selectedDisconnectionPoint === this.disconnectionPoint) {
          console.log('yes color')
          this.disconnectionPointDiv.nativeElement.style.backgroundColor =
            '#07ffd4'
        }
      } else {
        this.disconnectionPointDiv.nativeElement.style.backgroundColor =
          '#f9190f'
      }
    })
  }
}
