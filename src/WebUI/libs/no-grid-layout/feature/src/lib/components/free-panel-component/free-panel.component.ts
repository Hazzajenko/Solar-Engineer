import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CdkDrag, CdkDragDrop, CdkDragEnd, CdkDragMove, CdkDragStart, Point } from '@angular/cdk/drag-drop'
import { FreePanelModel, FreePanelUtil, PanelRotationConfig } from '@no-grid-layout/shared'
import { FreePanelDirective } from './free-panel.directive'
import { MousePositionService, ObjectPositioningService, PanelStylerService } from '@no-grid-layout/utils'
import { distinctUntilKeyChanged, map, Observable, tap } from 'rxjs'
import { BaseService } from '@shared/logger'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { throwIfNull$Extended } from '@shared/utils'
import { FreePanelsService, SelectedService } from '@no-grid-layout/data-access'

@Component({
  selector:        'app-free-panel',
  templateUrl:     './free-panel.component.html',
  styles:          [],
  imports:         [
    CommonModule,
    CdkDrag,
    FreePanelDirective,
    MatMenuModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone:      true,
})
export class FreePanelComponent
  extends BaseService
  implements OnInit,
             OnChanges {
  private _freePanelsService = inject(FreePanelsService)
  private _mousePositionService = inject(MousePositionService)
  private _objectPositioningService = inject(ObjectPositioningService)
  private _panelStylerService = inject(PanelStylerService)
  private _selectedService = inject(SelectedService)
  private _panelId!: string
  location!: Point
  menuTopLeftPosition = {
    x: '0',
    y: '0',
  }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  freePanel$!: Observable<FreePanelModel>
  protected readonly PanelRotationConfig = PanelRotationConfig

  get panelId() {
    return this._panelId
  }

  @Input() set panelId(value: string) {
    this._panelId = value
    this.freePanel$ = this._freePanelsService.getFreePanels$()
      .pipe(
        map((freePanels) => freePanels.find((freePanel) => freePanel.id === value)),
        throwIfNull$Extended('free-panel.component', 'freePanel$'),
        distinctUntilKeyChanged('id'),
        tap((freePanel) => {
            console.log('freePanel', freePanel)
            this.location = freePanel.location
          },
        ),
      )
  }

  ngOnInit() {
    console.log('ngOnInit', this._panelId)
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges', changes)
  }

  dragDropped(event: CdkDragDrop<FreePanelModel>) {
    console.log('dragDropped', event)
  }

  dragMoved(event: CdkDragMove<FreePanelModel>) {
    const size = FreePanelUtil.size(event.source.data.rotation)
    /*    const isOtherPanelInLine = this._objectPositioningService.isOtherObjectInLine(event.source.data.id)
     if (isOtherPanelInLine.length > 0) {
     console.log('isOtherPanelInLine', isOtherPanelInLine)
     this._panelStylerService.setStyleForPanelById(isOtherPanelInLine[0].id, 'border', '5px solid red')
     // this._panelStylerService.setStyleForPanelById(isOtherPanelInLine[0].id, 'backgroundColor', 'red')
     }
     const isOtherObjectNearby = this._objectPositioningService.isOtherObjectNearby(event.source.data.id)
     if (isOtherObjectNearby.length > 0) {
     console.log('isOtherObjectNearby', isOtherObjectNearby)
     }*/
    this.location = this._mousePositionService.getMousePositionFromPageXYWithSize(event.event as MouseEvent, size)
  }

  startDragging(event: CdkDragStart) {
    console.log('startDragging', event)
  }

  dragExited(event: CdkDragEnd) {
    console.log('dragExited', event)
    this._freePanelsService.updatePanelById(this.panelId, { location: this.location })
  }

  onRightClick(event: MouseEvent, freePanel: FreePanelModel) {
    event.preventDefault()
    const { x, y } = this._mousePositionService.getMousePositionFromPageXYWithSize(event)
    this.menuTopLeftPosition.x = x + 10 + 'px'
    this.menuTopLeftPosition.y = y + 10 + 'px'
    this.matMenuTrigger.menuData = { freePanel }
    this.matMenuTrigger.openMenu()
  }

  rotatePanel(freePanel: FreePanelModel) {
    // freePanel.rotation = (freePanel.rotation + 90) % 360
    freePanel.rotation = FreePanelUtil.oppositeRotation(freePanel.rotation)
    this._freePanelsService.updateFreePanel(freePanel)
  }

  deletePanel(freePanel: FreePanelModel) {
    this._freePanelsService.deleteFreePanel(freePanel)
  }
}
