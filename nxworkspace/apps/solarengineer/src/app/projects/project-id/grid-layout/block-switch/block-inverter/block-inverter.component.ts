import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatTooltipModule } from '@angular/material/tooltip'
import { AsyncPipe, NgIf, NgStyle } from '@angular/common'
import { FindCableLocationPipe } from '../../../../../pipes/find-cable-location.pipe'
import { GetNearbyJoins } from '../../../../../pipes/get-nearby-joins.pipe'
import { LetModule } from '@ngrx/component'
import { CableJoinComponent } from '../../../../../components/cable-join/cable-join.component'
import { InverterModel } from '../../../../models/deprecated-for-now/inverter.model'
import { InvertersEntityService } from '../../../services/ngrx-data/inverters-entity/inverters-entity.service'
import { RightClick } from '../right-click'
import { selectGridMode } from '../../../services/store/grid/grid.selectors'
import { map } from 'rxjs/operators'
import { selectSelectedId } from '../../../services/store/selected/selected.selectors'
import { distinctUntilChanged, Observable } from 'rxjs'
import { GridMode } from '../../../services/store/grid/grid-mode.model'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'

@Component({
  selector: 'app-block-inverter',
  template: `
    <ng-container *ngIf="inverter$ | async as inverter">
      <div
        (contextmenu)="onRightClick($event, inverter)"
        *ngIf="inverter.location"
        [cdkDragData]="inverter"
        [matTooltip]="'Location = ' + inverter.location + 'Inverter: ' + inverter.name"
        [style.border]="'2px solid ' + inverter.color"
        cdkDrag
        class="drop-zone__inverter"
        matTooltipPosition="right"
      ></div>
    </ng-container>
  `,
  styles: [
    `
      .right-click-menu {
        background-color: #f6eded;

        &__button {
          padding: 4px 6px;
          font-size: 12px;
          cursor: pointer;
          border-radius: inherit;

          &:hover {
            background: #545bff;
          }
        }
      }

      .drop-zone__inverter {
        background-color: #95c2fa;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          color: red;
          width: 23px;
          height: 23px;
        }
      }
    `,
  ],
  imports: [
    DragDropModule,
    MatTooltipModule,
    NgStyle,
    NgIf,
    FindCableLocationPipe,
    GetNearbyJoins,
    LetModule,
    CableJoinComponent,
    AsyncPipe,
  ],
  standalone: true,
})
export class BlockInverterComponent implements OnInit {
  @Input() location!: string
  @Output() rightClickInverter = new EventEmitter<RightClick>()
  gridMode$!: Observable<GridMode | undefined>
  inverter$!: Observable<InverterModel | undefined>
  selectedId$!: Observable<string | undefined>

  /*  @Input() inverter?: InverterModel
    @Input() block?: BlockModel
    @Input() grid?: {
      createMode?: UnitModel
      selectedStrings?: StringModel[]
      selectedString?: StringModel
      gridMode?: GridMode
    }*/

  constructor(private invertersEntity: InvertersEntityService, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.gridMode$ = this.store.select(selectGridMode)
    this.inverter$ = this.invertersEntity.entities$.pipe(
      map((inverters) => inverters.find((inverter) => inverter.location === this.location)),
    )
    // this.panelToJoin$ = this.store.select(selectPanelToJoin)
    this.selectedId$ = this.store.select(selectSelectedId).pipe(distinctUntilChanged())
    // this.selectedPositiveTo$ = this.store.select(selectSelectedPositiveTo)
    // this.selectedNegativeTo$ = this.store.select(selectSelectedNegativeTo)
    // this.selectedUnit$ = this.store.select(selectUnitSelected)
    // this.selectedStringTooltip$ = this.store.select(selectSelectedStringTooltip)
    // this.joinState$ = this.store.select(selectJoinsState)
  }

  onRightClick(event: MouseEvent, inverter: InverterModel) {
    event.preventDefault()
    this.rightClickInverter.emit({ event, item: inverter })
  }

  /*  getInverterObservable(
      location: string,
    ): Observable<InverterModel | undefined> {
      return this.invertersEntity.entities$.pipe(
        map((inverters) => {
          return inverters.find((inverter) => inverter.location === location)
        }),
      )
    }*/
}
