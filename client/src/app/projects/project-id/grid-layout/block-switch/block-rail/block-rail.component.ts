import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core'
import { GridMode } from '../../../services/store/grid/grid-mode.model'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatTooltipModule } from '@angular/material/tooltip'
import {
  AsyncPipe,
  NgClass,
  NgIf,
  NgStyle,
  NgTemplateOutlet,
} from '@angular/common'
import { FindPanelLocationPipe } from '../../../../../pipes/find-panel-location.pipe'
import { LetModule } from '@ngrx/component'
import { GetPanelJoinPipe } from '../../../../../pipes/get-panel-join.pipe'
import { PanelDirective } from '../../../../../directives/panel.directive'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { PanelLinkComponent } from '../../../../../components/panel-link/panel-link.component'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { BlockMenuComponent } from '../block-menu/block-menu.component'
import { GridStateActions } from '../../../services/store/grid/grid.actions'
import { SelectedStateActions } from '../../../services/store/selected/selected.actions'
import { distinctUntilChanged, firstValueFrom, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { selectSelectedId } from '../../../services/store/selected/selected.selectors'
import { selectGridMode } from '../../../services/store/grid/grid.selectors'
import { TrayJoinComponent } from './tray-join/tray-join.component'
import { RailSurroundingsAsyncPipe } from './rail-surroundings-async.pipe'
import { RailModel } from '../../../../models/rail.model'
import { RailsEntityService } from '../../../services/ngrx-data/rails-entity/rails-entity.service'

@Component({
  selector: 'app-block-rail',
  templateUrl: './block-rail.component.html',
  styleUrls: ['./block-rail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    MatMenuModule,
    BlockMenuComponent,
    NgTemplateOutlet,
    NgClass,
    TrayJoinComponent,
    RailSurroundingsAsyncPipe,
  ],
  standalone: true,
})
export class BlockRailComponent implements OnInit {
  @Input() location!: string
  rail$!: Observable<RailModel | undefined>

  selectedId$!: Observable<string | undefined>
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger

  constructor(
    private railsEntity: RailsEntityService,
    public store: Store<AppState>,
  ) {}

  ngOnInit() {
    this.rail$ = this.railsEntity.entities$.pipe(
      map((rails) => rails.find((r) => r.location === this.location)),
    )
    this.selectedId$ = this.store
      .select(selectSelectedId)
      .pipe(distinctUntilChanged())
  }

  displayTooltip(rail: RailModel): string {
    return `
       Location = ${rail.location} \r\n
    `
  }

  onRightClick(event: MouseEvent, rail: RailModel) {
    event.preventDefault()

    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.menuData = { rail }
    this.matMenuTrigger.openMenu()
  }

  deleteRail(rail: RailModel) {
    this.railsEntity.delete(rail)
  }

  railAction(rail: RailModel) {
    if (!rail) {
      return console.error('err railAction !rail')
    }

    firstValueFrom(this.store.select(selectGridMode))
      .then((gridMode) => {
        switch (gridMode) {
          case GridMode.DELETE:
            this.railsEntity.delete(rail)
            break
          case GridMode.SELECT:
            this.store.dispatch(
              SelectedStateActions.selectRail({ railId: rail.id }),
            )
            break
          default:
            this.store.dispatch(
              GridStateActions.changeGridmode({ mode: GridMode.SELECT }),
            )
            this.store.dispatch(
              SelectedStateActions.selectRail({ railId: rail.id }),
            )
            break
        }
      })
      .catch((err) => {
        return console.error(
          'err railAction this.store.select(selectGridMode)' + err,
        )
      })
  }
}
