import { ChangeDetectionStrategy, Component, ElementRef, inject, Input, NgZone, OnInit, Renderer2 } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CdkDrag, CdkDragDrop, CdkDragEnd, CdkDragMove, CdkDragStart, DragRef, Point } from '@angular/cdk/drag-drop'
import { FreePanelModel } from '../../free-panel.model'
import { FreePanelDirective } from './free-panel.directive'
import { NoGridLayoutService } from '../../no-grid-layout.service'
import { distinctUntilKeyChanged, map, Observable, tap } from 'rxjs'
import { Store } from '@ngrx/store'
import { throwIfNull$ } from '../../../../../../shared/utils/src/lib/observables/throw-if-null-$'
import { Logger } from 'tslog'
import { BaseService } from '@shared/logger'
import { FreePanelBlockConfig, PanelRotationConfig } from '../../configs/free-panel-block.config'
import { DelayedLogger } from '../../delayed-logger'
import { MousePositionService } from '../../mouse-position.service'

@Component({
  selector: 'app-free-panel',
  templateUrl: './free-panel.component.html',
  styles: [],
  imports: [
    CommonModule,
    CdkDrag,
    FreePanelDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FreePanelComponent extends BaseService implements OnInit {
  private elementRef = inject(ElementRef)
  private noGridLayoutService = inject(NoGridLayoutService)
  // private freePanelsFacade = inject(FreePanelsFacade)
  private store = inject(Store)
  private ngZone = inject(NgZone)
  private renderer = inject(Renderer2)
  protected readonly PanelRotationConfig = PanelRotationConfig
  private log = new Logger({ name: 'free-panel.component' })
  delayedLogger = new DelayedLogger()
  private _location!: Point
  private mousePositionService = inject(MousePositionService)
  _panelId!: string
  // freePanel$ = of({} as FreePanelModel)
  freePanel$!: Observable<FreePanelModel | undefined>
  pageX = 0
  pageY = 0

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
    this.dragPosition = value
  }

  get location() {
    return this._location
  }

  savedPosition: { x: number, y: number } = { x: 0, y: 0 }
  rotation = 0
  private _dragPosition: any
  set dragPosition(value: any) {
    // console.log('dragPosition', value)
    this._dragPosition = value
  }

  get dragPosition() {
    return this._dragPosition
  }

  ngOnInit() {
    console.log('ngOnInit', this)
    /*    this.renderer.listen(this.elementRef.nativeElement, 'mousemove', (event: MouseEvent) => {
     event.stopPropagation()
     event.preventDefault()
     this.onMouseMoveHandler(event)
     })*/
  }

  private onMouseMoveHandler(event: MouseEvent) {
    this.location = this.mousePositionService.getMousePosition(event)
    // const parentElement = this.elementRef.nativeElement.parentElement
    // console.log('onMouseMoveHandler', event, parentElement)

    // console.log('left', rect.left, 'top', rect.top, 'right', rect.right, 'bottom', rect.bottom)
    /*    const mouseX = event.pageX - rect.left / this.scale
     const mouseY = event.pageY - rect.top / this.scale*/
    /* const mouseX = (event.pageX - rect.left) / this.scale
     const mouseY = (event.pageY - rect.top) / this.scale*/
    /*if (this.isCtrlDragging) {
     if (!event.ctrlKey) {
     this.isCtrlDragging = false
     this.startX = undefined
     this.startY = undefined
     return
     }
     this.handleCtrlMouseMove(event)
     return
     }
     if (this.isDragging) {
     /!*      if (event.ctrlKey) {
     return this.handleCtrlMouseMove(event)
     }*!/
     const panelId = (event.composedPath()[0] as HTMLDivElement).getAttribute('panelId')
     if (panelId) {
     this.selectedPanelId = panelId
     this.pageX = event.pageX
     this.pageY = event.pageY
     this.ngZone.runOutsideAngular(() => {
     this.animateLinesFromBlockMoving()
     })
     }
     }*/
    return
  }

  click(event: MouseEvent) {
    /*  const rect = this.freePanelRef.nativeElement.getBoundingClientRect()

     this.startX = xy.x - rect.left
     this.startY = xy.y - rect.top*/
    /*    this.pageX = event.pageX
     this.pageY = event.pageY
     const rect = this.freePanelRef.nativeElement.getBoundingClientRect()

     const mouseX = this.pageX - rect.left
     const mouseY = this.pageY - rect.top*/
  }

  dragDropped(event: CdkDragDrop<FreePanelModel>) {
    // event.preventDefault()
    console.log('dragDropped', event)
    // dragPosition
    // this.dragPosition = { x: this.location.x, y: this.location.y }
// this.dragPosition = { x: event.source.getFreeDragPosition().x, y: event.source.getFreeDragPosition().y }
  }

  dragMoved(event: CdkDragMove<FreePanelModel>) {
    this.delayedLogger.log('dragMoved', event)
    // event.source.data.rotation
    const size = FreePanelBlockConfig.size(event.source.data.rotation)
    this.location = this.mousePositionService.getMousePosition(event.event as MouseEvent, size)
    // this.delayedLogger.log('getFreeDragPosition', event.source.getFreeDragPosition())
    // this.location = { x: this.location.x + event.delta.x, y: this.location.y + event.delta.y }

    // this.dragPosition = { x: this., y: event.source.getFreeDragPosition().y }
    // this.dragPosition = { x: event.source.getFreeDragPosition().x, y: event.source.getFreeDragPosition().y }
    // const
    // event.preventDefault()
    // console.log('dragMoved', event)
    // this.savedPosition = { x: event.source.getFreeDragPosition().x, y: event.source.getFreeDragPosition().y }
    // console.log('savedPosition', this.savedPosition)
  }

  dragConstrainPoint = (point: Point, dragRef: DragRef) => {
    let zoomMoveXDifference = 0
    let zoomMoveYDifference = 0
    this.delayedLogger.log('dragConstrainPoint', point, dragRef)
    this.delayedLogger.log('scale', this.mousePositionService.scale)

    if (this.mousePositionService.scale != 1) {
      /*      zoomMoveXDifference = (1 - this.mousePositionService.scale) * dragRef.getFreeDragPosition().x
       zoomMoveYDifference = (1 - this.mousePositionService.scale) * dragRef.getFreeDragPosition().y*/
      zoomMoveXDifference = (1 - this.mousePositionService.scale) * dragRef.getFreeDragPosition().x
      zoomMoveYDifference = (1 - this.mousePositionService.scale) * dragRef.getFreeDragPosition().y
    }

    return {
      x: point.x + zoomMoveXDifference as number,
      y: point.y + zoomMoveYDifference as number,
    }
  }

  startDragging(event: CdkDragStart) {
    console.log('startDragging', event)
    /*    const position = {
     x: this.dragPosition.x * this.mousePositionService.scale,
     y: this.dragPosition.y * this.mousePositionService.scale,
     }
     event.source._dragRef.setFreeDragPosition(position);
     (event.source._dragRef as any)._activeTransform = this.dragPosition;
     (event.source._dragRef as any)._applyRootElementTransform(this.dragPosition.x, this.dragPosition.y)*/
    /*    event.source._dragRef.setFreeDragPosition(this.location);
     (event.source._dragRef as any)._activeTransform = this.location;
     (event.source._dragRef as any)._applyRootElementTransform(this.location.x, this.location.y)*/
  }

  /*  ngAfterViewInit(): void {
   /!*    const rect = this.freePanelRef.nativeElement.getBoundingClientRect()
   console.log('rect', rect)
   // this.dragPosition = { x: this.freePanel.x, y: this.freePanel.y }
   const mouseX = this.pageX - rect.left
   const mouseY = this.pageY - rect.top
   this.dragPosition = { x: this.freePanel.x + mouseX, y: this.freePanel.y + mouseY }*!/

   }*/

  constrainPosition(userPointerPosition: Point, dragRef: DragRef, dimensions: ClientRect, pickupPositionInElement: Point): Point {
    // const newLoggable = this.log.withPrefix('constrainPosition')
    const newLoggy = new Logger({ name: 'constrainPosition', stylePrettyLogs: true })
    newLoggy.debug('constrainPosition', userPointerPosition, dragRef, dimensions, pickupPositionInElement)
    // this.log.debug('constrainPosition', userPointerPosition, dragRef, dimensions, pickupPositionInElement)
    return userPointerPosition
    // console.log('constrainPosition', event)

    // return undefined
  }

  dragExited(event: CdkDragEnd) {
    console.log('dragDropped', event)
    // dragPosition
    this.dragPosition = { x: this.location.x, y: this.location.y }
  }
}
