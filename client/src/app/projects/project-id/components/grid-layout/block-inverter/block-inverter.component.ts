import { Component, EventEmitter, Input, Output } from '@angular/core'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatTooltipModule } from '@angular/material/tooltip'
import { AsyncPipe, NgIf, NgStyle } from '@angular/common'
import { FindCableLocationPipe } from '../../../../../pipes/find-cable-location.pipe'
import { GetNearbyJoins } from '../../../../../pipes/get-nearby-joins.pipe'
import { LetModule } from '@ngrx/component'
import { CableJoinComponent } from '../../../../../components/cable-join/cable-join.component'
import { InverterModel } from '../../../../models/inverter.model'
import { InvertersEntityService } from '../../../services/inverters-entity/inverters-entity.service'
import { RightClick } from '../block-switch/right-click'

@Component({
  selector: 'app-block-inverter',
  template: `
    <ng-container *ngIf="inverter">
      <div
        (contextmenu)="onRightClick($event, inverter)"
        *ngIf="inverter.location"
        [cdkDragData]="inverter"
        [matTooltip]="
          'Location = ' + inverter.location + 'Inverter: ' + inverter.name
        "
        [style.border]="'2px solid ' + inverter.color"
        cdkDrag
        class="drop-zone__inverter"
        matTooltipPosition="right"
      ></div>
    </ng-container>
  `,
  styles: [
    `
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
export class BlockInverterComponent {
  @Input() inverter?: InverterModel
  @Output() rightClickInverter = new EventEmitter<RightClick>()

  /*  @Input() inverter?: InverterModel
    @Input() block?: BlockModel
    @Input() grid?: {
      createMode?: UnitModel
      selectedStrings?: StringModel[]
      selectedString?: StringModel
      gridMode?: GridMode
    }*/

  constructor(private invertersEntity: InvertersEntityService) {}

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
