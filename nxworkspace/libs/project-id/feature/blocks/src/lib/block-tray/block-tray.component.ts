import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'

import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatTooltipModule } from '@angular/material/tooltip'
import { AsyncPipe, NgClass, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common'

import { LetModule } from '@ngrx/component'

import { Store } from '@ngrx/store'

import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'

import { distinctUntilChanged, firstValueFrom, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { TrayJoinComponent } from '../ui/tray-join/tray-join.component'
import {
  GridStateActions,
  SelectedStateActions,
  selectGridMode,
  selectSelectedId,
  TraysEntityService,
} from '@grid-layout/data-access/store'
import { GridMode, TrayModel } from '@shared/data-access/models'
import { AppState } from '@shared/data-access/store'
import { GetTrayJoinsPipe } from '@grid-layout/pipes'


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
    AsyncPipe,
    LetModule,
    MatMenuModule,
    NgTemplateOutlet,
    NgClass,
    TrayJoinComponent,
    GetTrayJoinsPipe,
  ],
  standalone: true,
})
export class BlockTrayComponent implements OnInit {
  private store = inject(Store<AppState>)
  private traysEntity = inject(TraysEntityService)
  @Input() location!: string

  tray$!: Observable<TrayModel | undefined>

  selectedId$!: Observable<string | undefined>
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger

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
