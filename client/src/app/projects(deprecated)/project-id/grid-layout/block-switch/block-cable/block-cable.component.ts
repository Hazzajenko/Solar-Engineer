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
import { CableModel } from '../../../../models/deprecated-for-now/cable.model'
import { FindCableLocationPipe } from '../../../../pipes/find-cable-location.pipe'
import { GetNearbyJoins } from '../../../../pipes/get-nearby-joins.pipe'
import { LetModule } from '@ngrx/component'
import { GetCableJoin } from '../../../../pipes/get-cable-join.pipe'
import { GetCablesInJoinPipe } from '../../../../pipes/get-cables-in-join.pipe'
import { distinctUntilChanged, firstValueFrom, Observable } from 'rxjs'
import { RightClick } from '../right-click'
import { GetCableSurroundingsPipe } from './get-surroundings.pipe'
import { map } from 'rxjs/operators'
import { CablesEntityService } from '../../../services/ngrx-data/cables-entity/cables-entity.service'
import { GetSurroundingsAsyncPipe } from './get-surroundings-async.pipe'
import { GetCablesInJoinLengthPipe } from './get-cables-in-join-async.pipe'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { selectGridMode } from '../../../services/store/grid/grid.selectors'
import { GridMode } from '../../../services/store/grid/grid-mode.model'
import { SelectedStateActions } from '../../../services/store/selected/selected.actions'
import { GridStateActions } from '../../../services/store/grid/grid.actions'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { selectCableToLink } from '../../../services/store/links/links.selectors'
import {
  selectSelectedId,
  selectSelectedNegativeTo,
  selectSelectedPositiveTo,
} from '../../../services/store/selected/selected.selectors'

@Component({
  selector: 'app-block-cable',
  templateUrl: 'block-cable.component.html',
  styleUrls: ['./block-cable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DragDropModule,
    MatTooltipModule,
    NgStyle,
    NgIf,
    FindCableLocationPipe,
    GetNearbyJoins,
    LetModule,
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
  cableToLink$!: Observable<CableModel | undefined>
  selectedPositiveTo$!: Observable<string | undefined>
  selectedNegativeTo$!: Observable<string | undefined>

  constructor(
    private cablesEntity: CablesEntityService,
    private store: Store<AppState>,
  ) {}

  onRightClick(event: MouseEvent, cable: CableModel) {
    event.preventDefault()
    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.menuData = { cable }
    this.matMenuTrigger.openMenu()
  }

  ngOnInit(): void {
    this.cable$ = this.cablesEntity.entities$.pipe(
      map((cables) => cables.find((cable) => cable.location === this.location)),
    )
    this.cableToLink$ = this.store.select(selectCableToLink)
    this.selectedId$ = this.store.select(selectSelectedId).pipe(distinctUntilChanged())
    this.selectedPositiveTo$ = this.store.select(selectSelectedPositiveTo)
    this.selectedNegativeTo$ = this.store.select(selectSelectedNegativeTo)
  }

  cableAction(cable: CableModel) {
    if (!cable) {
      return console.error('err cableAction !cable')
    }

    firstValueFrom(this.store.select(selectGridMode))
      .then((gridMode) => {
        switch (gridMode) {
          case GridMode.LINK:
            // return this.joinsService.addDpToJoin(disconnectionPoint)
            break

          case GridMode.DELETE:
            this.cablesEntity.delete(cable)
            break
          case GridMode.SELECT:
            this.store.dispatch(SelectedStateActions.selectCable({ cableId: cable.id }))
            break
          default:
            this.store.dispatch(GridStateActions.changeGridmode({ mode: GridMode.SELECT }))
            this.store.dispatch(SelectedStateActions.selectCable({ cableId: cable.id }))
            break
        }
      })
      .catch((err) => {
        return console.error('err cableAction this.store(deprecated).select(selectGridMode)' + err)
      })
  }

  deleteCable(cable: CableModel) {
    this.cablesEntity.delete(cable)
  }
}