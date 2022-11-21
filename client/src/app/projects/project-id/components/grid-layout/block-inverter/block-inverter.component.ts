import { Component, Input } from '@angular/core'
import { BlockModel } from '../../../../models/block.model'
import { UnitModel } from '../../../../models/unit.model'
import { StringModel } from '../../../../models/string.model'
import { GridMode } from '../../../../store/grid/grid-mode.model'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatTooltipModule } from '@angular/material/tooltip'
import { NgIf, NgStyle } from '@angular/common'
import { FindCableLocationPipe } from '../../../../../pipes/find-cable-location.pipe'
import { GetNearbyJoins } from '../../../../../pipes/get-nearby-joins.pipe'
import { LetModule } from '@ngrx/component'
import { CableJoinComponent } from '../../../../../components/cable-join/cable-join.component'
import { InverterModel } from '../../../../models/inverter.model'

@Component({
  selector: 'app-block-inverter',
  template: `
    <ng-container *ngIf="inverter && block && grid">
      <div
        *ngIf="inverter.location === block.location"
        [cdkDragData]="inverter"
        [matTooltip]="
          'Location = ' + inverter.location + 'Inverter: ' + inverter.name
        "
        [style.border]="'2px solid ' + block.color"
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
  ],
  standalone: true,
})
export class BlockInverterComponent {
  @Input() inverter?: InverterModel
  @Input() block?: BlockModel
  @Input() grid?: {
    createMode?: UnitModel
    selectedStrings?: StringModel[]
    selectedString?: StringModel
    gridMode?: GridMode
  }

  constructor() {}
}
