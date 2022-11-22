import { Component, Input } from '@angular/core'
import { BlockModel } from '../../../../models/block.model'
import { UnitModel } from '../../../../models/unit.model'
import { StringModel } from '../../../../models/string.model'
import { GridMode } from '../../../../store/grid/grid-mode.model'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatTooltipModule } from '@angular/material/tooltip'
import { NgIf, NgStyle } from '@angular/common'
import { CableModel } from '../../../../models/cable.model'
import { FindCableLocationPipe } from '../../../../../pipes/find-cable-location.pipe'
import { GetNearbyJoins } from '../../../../../pipes/get-nearby-joins.pipe'
import { LetModule } from '@ngrx/component'
import { CableJoinComponent } from '../../../../../components/cable-join/cable-join.component'
import { GetCableSurroundingsPipe } from '../../../../../pipes/get-cable-surroundings.pipe'

@Component({
  selector: 'app-block-cable',
  template: `
    <ng-container *ngIf="cable && block && grid">
      <ng-container *ngIf="cable | getCableSurroundings; let surroundingModel">
        <div class="drop-zone">
          <app-cable-join
            *ngIf="surroundingModel"
            [surroundings]="surroundingModel!"
            class="drop-zone__svg"
          ></app-cable-join>
          <div
            *ngIf="cable.location === block?.location"
            [cdkDragData]="cable"
            [matTooltip]="
              'Location = ' + cable.location + ' JoinId: ' + cable.join_id
            "
            [ngStyle]="{
              'background-color': toJoinArray?.includes(cable.location)
                ? '#07ffd4'
                : '#fb7344'
            }"
            [style.border]="'2px solid ' + block?.color"
            cdkDrag
            class="drop-zone__cable"
            matTooltipPosition="right"
          >
            <!--            P-->
          </div>
        </div>
      </ng-container>
    </ng-container>
  `,
  styles: [
    `
      .drop-zone {
        display: flex;
        justify-content: center;
        align-items: center;
        border: #24292e;
        background-color: #f6eded;
        width: 30px;
        height: 30px;

        &__svg {
          pointer-events: none;
          z-index: 1;
          position: relative;
          top: 1.8px;
        }

        &__cable {
          position: absolute;
          background-color: #486079;
          width: 20px;
          height: 20px;
          display: flex;

          &:hover {
            color: red;
            width: 23px;
            height: 23px;
          }
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
    GetCableSurroundingsPipe,
  ],
  standalone: true,
})
export class BlockCableComponent {
  @Input() cable?: CableModel
  @Input() block?: BlockModel
  @Input() grid?: {
    createMode?: UnitModel
    selectedStrings?: StringModel[]
    selectedString?: StringModel
    gridMode?: GridMode
  }
  @Input() toJoinArray?: string[]

  constructor() {}
}
