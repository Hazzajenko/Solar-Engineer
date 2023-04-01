import { ChangeDetectionStrategy, Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CdkDrag, CdkDragDrop, CdkDragEnd, CdkDragMove, CdkDragStart, Point } from '@angular/cdk/drag-drop'
import { FreePanelModel } from '../../free-panel.model'
import { FreePanelDirective } from './free-panel.directive'
import { NoGridLayoutService } from '../../no-grid-layout.service'
import { distinctUntilKeyChanged, map, Observable, tap } from 'rxjs'
import { throwIfNull$ } from '../../../../../../shared/utils/src/lib/observables/throw-if-null-$'
import { Logger } from 'tslog'
import { BaseService } from '@shared/logger'
import { FreePanelUtil, PanelRotationConfig } from '../../configs/free-panel.util'
import { DelayedLogger } from '../../delayed-logger'
import { MousePositionService } from '../../mouse-position.service'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'

@Component({
  selector: 'app-free-panel',
  templateUrl: './free-panel.component.html',
  styles: [],
  imports: [
    CommonModule,
    CdkDrag,
    FreePanelDirective,
    MatMenuModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FreePanelComponent extends BaseService implements OnInit {
  public elementRef = inject(ElementRef)
  private noGridLayoutService = inject(NoGridLayoutService)
  protected readonly PanelRotationConfig = PanelRotationConfig
  private log = new Logger({ name: 'free-panel.component' })
  delayedLogger = new DelayedLogger()
  private _location!: Point
  private mousePositionService = inject(MousePositionService)

  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  private _panelId!: string
  freePanel$!: Observable<FreePanelModel | undefined>

  get panelId() {
    return this._panelId
  }

  @Input() set panelId(value: string) {
    this._panelId = value
    this.freePanel$ = this.noGridLayoutService.getFreePanels$().pipe(
      map((freePanels) => freePanels.find((freePanel) => freePanel.id === value)),
      throwIfNull$('free-panel.component', 'freePanel$'),
      distinctUntilKeyChanged('id'),
      tap((freePanel) => {
          const logger = new Logger({ name: 'free-panel.component' })
          logger.info('freePanel', freePanel)
        },
      ),
    )
  }

  @Input() set location(value: Point) {
    this._location = value
  }

  get location() {
    return this._location
  }

  ngOnInit() {
    console.log('ngOnInit', this)
  }

  dragDropped(event: CdkDragDrop<FreePanelModel>) {
    console.log('dragDropped', event)
  }

  dragMoved(event: CdkDragMove<FreePanelModel>) {
    this.delayedLogger.log('dragMoved', event)
    const size = FreePanelUtil.size(event.source.data.rotation)
    this.location = this.mousePositionService.getMousePositionFromPageXY(event.event as MouseEvent, size)
  }

  startDragging(event: CdkDragStart) {
    console.log('startDragging', event)
  }

  dragExited(event: CdkDragEnd) {
    console.log('dragDropped', event)
  }

  onRightClick(event: MouseEvent, freePanel: FreePanelModel) {
    event.preventDefault()
    const { x, y } = this.mousePositionService.getMousePositionFromPageXY(event)
    this.menuTopLeftPosition.x = x + 10 + 'px'
    this.menuTopLeftPosition.y = y + 10 + 'px'
    this.matMenuTrigger.menuData = { freePanel }
    this.matMenuTrigger.openMenu()
  }

  rotatePanel(freePanel: FreePanelModel) {
    // freePanel.rotation = (freePanel.rotation + 90) % 360
    freePanel.rotation = FreePanelUtil.oppositeRotation(freePanel.rotation)
    this.noGridLayoutService.updateFreePanel(freePanel)
  }

  deletePanel(freePanel: FreePanelModel) {
    this.noGridLayoutService.deleteFreePanel(freePanel)
  }
}
