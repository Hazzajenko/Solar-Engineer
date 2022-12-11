import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { GridMode } from '../../../services/store/grid/grid-mode.model'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatTooltipModule } from '@angular/material/tooltip'
import { AsyncPipe, NgClass, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common'
import { FindPanelLocationPipe } from '../../../../../pipes/find-panel-location.pipe'
import { LetModule } from '@ngrx/component'
import { GetPanelJoinPipe } from '../../../../../pipes/get-panel-join.pipe'
import { PanelDirective } from '../../../../../directives/panel.directive'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { PanelLinkComponent } from '../block-panel/panel-link/panel-link.component'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { BlockMenuComponent } from '../block-menu/block-menu.component'
import { RightClick } from '../right-click'
import { GridStateActions } from '../../../services/store/grid/grid.actions'
import { SelectedStateActions } from '../../../services/store/selected/selected.actions'
import { distinctUntilChanged, firstValueFrom, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { selectSelectedId } from '../../../services/store/selected/selected.selectors'
import { selectGridMode } from '../../../services/store/grid/grid.selectors'
import { TrayModel } from '../../../../models/deprecated-for-now/tray.model'
import { TraysEntityService } from '../../../services/ngrx-data/trays-entity/trays-entity.service'
import { TrayJoinComponent } from './tray-join/tray-join.component'
import { TraySurroundingsAsyncPipe } from './tray-surroundings-async.pipe'

@Component({
  selector: 'app-block-tray',
  templateUrl: './block-tray.component.html',
  styleUrls: ['./block-tray.component.scss'],
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
    TraySurroundingsAsyncPipe,
  ],
  standalone: true,
})
export class BlockTrayComponent implements OnInit {
  @Input() location!: string

  @Output() rightClickPanel = new EventEmitter<RightClick>()
  tray$!: Observable<TrayModel | undefined>

  selectedId$!: Observable<string | undefined>
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger

  constructor(private traysEntity: TraysEntityService, public store: Store<AppState>) {}

  ngOnInit() {
    this.tray$ = this.traysEntity.entities$.pipe(
      map((trays) => trays.find((tray) => tray.location === this.location)),
    )
    this.selectedId$ = this.store.select(selectSelectedId).pipe(distinctUntilChanged())
  }

  displayTooltip(tray: TrayModel): string {
    return `
       Size = ${tray.size} \r\n
    `
  }

  onRightClick(event: MouseEvent, tray: TrayModel) {
    event.preventDefault()

    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.menuData = { tray }
    this.matMenuTrigger.openMenu()
  }

  deleteTray(tray: TrayModel) {
    this.traysEntity.delete(tray)
  }

  trayAction(tray: TrayModel) {
    if (!tray) {
      return console.error('err trayAction !tray')
    }

    firstValueFrom(this.store.select(selectGridMode))
      .then((gridMode) => {
        switch (gridMode) {
          case GridMode.DELETE:
            this.traysEntity.delete(tray)
            break
          case GridMode.SELECT:
            this.store.dispatch(SelectedStateActions.selectTray({ trayId: tray.id }))
            break
          default:
            this.store.dispatch(GridStateActions.changeGridmode({ mode: GridMode.SELECT }))
            this.store.dispatch(SelectedStateActions.selectTray({ trayId: tray.id }))
            break
        }
      })
      .catch((err) => {
        return console.error('err trayAction this.store.select(selectGridMode)' + err)
      })
  }
}
