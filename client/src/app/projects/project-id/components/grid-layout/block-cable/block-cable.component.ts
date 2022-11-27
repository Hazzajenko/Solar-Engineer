import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatTooltipModule } from '@angular/material/tooltip'
import { AsyncPipe, NgIf, NgStyle } from '@angular/common'
import { CableModel } from '../../../../models/cable.model'
import { FindCableLocationPipe } from '../../../../../pipes/find-cable-location.pipe'
import { GetNearbyJoins } from '../../../../../pipes/get-nearby-joins.pipe'
import { LetModule } from '@ngrx/component'
import { CableJoinComponent } from '../../../../../components/cable-join/cable-join.component'
import {
  GetCableSurroundingsPipe,
  SurroundingModel,
} from '../../../../../pipes/get-cable-surroundings.pipe'
import { GetCableJoin } from '../../../../../pipes/get-cable-join.pipe'
import { GetCablesInJoinPipe } from '../../../../../pipes/get-cables-in-join.pipe'
import { CablesEntityService } from '../../../services/cables-entity/cables-entity.service'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { RightClick } from '../block-switch/right-click'

@Component({
  selector: 'app-block-cable',
  template: `
    <ng-container *ngIf="cable">
      <!--      <ng-container
              *ngIf="
                getSurroundingsV2(cable, (allCables$ | async)!);
                let surroundingModel
              "
            >-->
      <!--      <ng-container *ngIf="getSurroundings(cable); let surroundingModel">-->
      <div class="drop-zone">
        <app-cable-join
          *ngIf="surroundings"
          [surroundings]="surroundings!"
          class="drop-zone__svg"
        ></app-cable-join>
        <div
          (contextmenu)="onRightClick($event, cable)"
          [cdkDragData]="cable"
          [matTooltip]="
            'Location = ' +
            cable.location +
            ' JoinId: ' +
            cable.join_id +
            'CablesInJoin: ' +
            (getCablesInJoin(cable.join_id!) | async)
          "
          [style.border]="'2px solid ' + cable.color"
          cdkDrag
          class="drop-zone__cable"
          matTooltipPosition="right"
        >
          <!--            P-->
        </div>
      </div>
      <!--      </ng-container>-->
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
  ],
  standalone: true,
})
export class BlockCableComponent
  implements OnInit, AfterViewInit, AfterContentInit
{
  @Output() rightClickCable = new EventEmitter<RightClick>()
  @Input() cable?: CableModel
  @Input() allCables?: CableModel[]
  surroundings?: SurroundingModel
  allCables$!: Observable<CableModel[]>

  constructor(public cablesEntity: CablesEntityService) {}

  ngAfterContentInit(): void {
    this.getSurroundingsV2()
  }

  onRightClick(event: MouseEvent, cable: CableModel) {
    event.preventDefault()
    this.rightClickCable.emit({ event, item: cable })
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    // this.allCables$ = this.cablesEntity.entities$
    /*    if (typeof Worker !== 'undefined') {
          // Create a new
          const worker = new Worker(
            new URL('./block-cable.worker', import.meta.url),
          )
          worker.onmessage = ({ data }) => {
            console.log(`page got message: ${data}`)
          }
          worker.postMessage('hello')
        } else {
          // Web Workers are not supported in this environment.
          // You should add a fallback so that your program still executes correctly.
        }*/
  }

  getSurroundingsV2() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(
        new URL('./block-cable.worker', import.meta.url),
      )
      worker.onmessage = ({ data }) => {
        this.surroundings = {
          left: data.left,
          right: data.right,
          top: data.top,
          bottom: data.bottom,
        }
      }
      const message = {
        cable: this.cable,
        allCables: this.allCables,
      }
      worker.postMessage(message)
    } else {
    }
  }

  getCablesInJoin(joinId: string): Observable<number | undefined> {
    return this.cablesEntity.entities$.pipe(
      map((cables) => {
        return cables.filter((cable) => cable.join_id === joinId).length
      }),
    )
  }

  getSurroundings(cable: CableModel): SurroundingModel {
    if (!cable) {
      return {
        left: false,
        right: false,
        top: false,
        bottom: false,
      } as SurroundingModel
    }

    let numberRow: number = 0
    let numberCol: number = 0

    const location = cable.location
    const split = location.split('')
    split.forEach((p, index) => {
      if (p === 'c') {
        const row = location.slice(3, index)
        const col = location.slice(index + 3, location.length)
        numberRow = Number(row)
        numberCol = Number(col)
      }
    })
    const topString: string = `row${numberRow - 1}col${numberCol}`
    const bottomString: string = `row${numberRow + 1}col${numberCol}`
    const leftString: string = `row${numberRow}col${numberCol - 1}`
    const rightString: string = `row${numberRow}col${numberCol + 1}`

    let allCables: CableModel[] = []
    this.cablesEntity.entities$.subscribe((cables) => {
      allCables = cables
    })

    const findTop = allCables.find((cable) => cable.location === topString)
    const findBottom = allCables.find(
      (cable) => cable.location === bottomString,
    )
    const findLeft = allCables.find((cable) => cable.location === leftString)
    const findRight = allCables.find((cable) => cable.location === rightString)

    if (findTop) console.log('FIND TOP', findTop.location)
    if (findBottom) console.log('FIND BOTTOM', findBottom.location)
    if (findLeft) console.log('FIND LEFT', findLeft.location)
    if (findRight) console.log('FIND RIGHT', findRight.location)

    return {
      left: !!findLeft,
      right: !!findRight,
      top: !!findTop,
      bottom: !!findBottom,
    } as SurroundingModel
  }
}
