import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatTooltipModule } from '@angular/material/tooltip'
import { AsyncPipe, NgIf, NgStyle } from '@angular/common'
import { CableModel } from '../../../../models/cable.model'
import { FindCableLocationPipe } from '../../../../../pipes/find-cable-location.pipe'
import { GetNearbyJoins } from '../../../../../pipes/get-nearby-joins.pipe'
import { LetModule } from '@ngrx/component'
import { CableJoinComponent } from '../../../../../components/cable-join/cable-join.component'
import { GetCableJoin } from '../../../../../pipes/get-cable-join.pipe'
import { GetCablesInJoinPipe } from '../../../../../pipes/get-cables-in-join.pipe'
import { Observable } from 'rxjs'
import { RightClick } from '../block-switch/right-click'
import { GetCableSurroundingsPipe } from './get-surroundings.pipe'
import { map } from 'rxjs/operators'
import { CablesEntityService } from '../../../services/cables-entity/cables-entity.service'
import { GetSurroundingsAsyncPipe } from './get-surroundings-async.pipe'
import { GetCablesInJoinLengthPipe } from './get-cables-in-join-async.pipe'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'

@Component({
  selector: 'app-block-cable',
  templateUrl: 'block-cable.component.html',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    GetCableJoin,
    AsyncPipe,
    GetCablesInJoinPipe,
    GetCablesInJoinLengthPipe,
    GetSurroundingsAsyncPipe,
    GetCablesInJoinLengthPipe,
    MatMenuModule,
  ],
  standalone: true,
})
export class BlockCableComponent implements OnInit {
  @Output() rightClickCable = new EventEmitter<RightClick>()
  // @Input() cable?: CableModel
  @Input() location!: string
  // @Input() cables?: CableModel[]
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  cable$!: Observable<CableModel | undefined>

  selectedId$!: Observable<string | undefined>

  constructor(private cablesEntity: CablesEntityService) {}

  onRightClick(event: MouseEvent, cable: CableModel) {
    event.preventDefault()
    // this.rightClickCable.emit({ event, item: cable })
    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.menuData = { cable }
    this.matMenuTrigger.openMenu()
  }

  ngOnInit(): void {
    this.cable$ = this.cablesEntity.entities$.pipe(
      map((cables) => cables.find((cable) => cable.location === this.location)),
    )
  }

  deleteCable(cable: CableModel) {}
}
