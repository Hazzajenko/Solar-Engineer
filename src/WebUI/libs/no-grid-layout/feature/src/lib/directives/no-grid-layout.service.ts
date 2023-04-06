// import { Logger } from '@ngrx/data'
import { Point } from '@angular/cdk/drag-drop'
import { inject, NgZone, Renderer2 } from '@angular/core'
import { FreePanelsService } from '@no-grid-layout/data-access'
import {
  CanvasService,
  ClickService,
  ComponentElementsService,
  MousePositionService,
  MultiSelectService,
  ScreenMoveService,
} from '@no-grid-layout/utils'
import { XyLocation } from '@shared/data-access/models'


export class NoGridLayoutService {
  protected _screenMoveService = inject(ScreenMoveService)
  protected _renderer = inject(Renderer2)
  protected _freePanelsService = inject(FreePanelsService)
  protected _clickService = inject(ClickService)
  protected _canvasService = inject(CanvasService)
  protected _mousePositionService = inject(MousePositionService)
  protected _componentElementService = inject(ComponentElementsService)
  protected _multiSelectService = inject(MultiSelectService)
  protected _ngZone: NgZone = inject(NgZone)
  private _canvas!: HTMLCanvasElement
  private _ctx!: CanvasRenderingContext2D
  private _clickTimeout: NodeJS.Timeout | undefined
  private _pagePoint: XyLocation | undefined
  private _scale = 1
  private _screenPosition: XyLocation = { x: 0, y: 0 }
  private _isDragging = false
  private _isScreenDragging = false
  private _isShiftDragging = false
  private _isAltDragging = false
  private _animationId?: number
  private _fillStyle = '#7585d8'
  private _startPoint?: Point
  private _canvasStartPoint?: Point
  private _selectedPanelId?: string

  protected get canvas() {
    return this._canvas
  }

  protected set canvas(value: HTMLCanvasElement) {
    this._canvas = value
    this._canvasService.canvas = value
  }

  protected get ctx(): CanvasRenderingContext2D {
    return this._ctx
  }

  protected set ctx(value: CanvasRenderingContext2D) {
    this._ctx = value
    this._canvasService.ctx = value
  }

  protected get clickTimeout(): NodeJS.Timeout | undefined {
    return this._clickTimeout
  }

  protected set clickTimeout(value: NodeJS.Timeout | undefined) {
    this._clickTimeout = value
  }

  protected get pagePoint(): XyLocation | undefined {
    return this._pagePoint
  }

  protected set pagePoint(value: XyLocation | undefined) {
    this._pagePoint = value
    // console.log('set pagePoint', value)
  }

  protected get scale() {
    return this._scale
  }

  protected set scale(value) {
    this._scale = value
    this._mousePositionService.scale = value
  }

  protected set screenProperties(options: { scale: number; screenPosition: XyLocation }) {
    this.scale = options.scale
    this.screenPosition = options.screenPosition
  }

  protected get screenPosition(): XyLocation {
    return this._screenPosition
  }

  protected set screenPosition(value: XyLocation) {
    this._screenPosition = value
    // this._mousePositionService.screenPosition = value
  }

  protected get isDragging() {
    return this._isDragging
  }

  protected set isDragging(value) {
    this._isDragging = value
  }

  protected get isScreenDragging() {
    return this._isScreenDragging
  }

  protected set isScreenDragging(value) {
    this._isScreenDragging = value
  }

  protected get isShiftDragging() {
    return this._isShiftDragging
  }

  protected set isShiftDragging(value) {
    this._isShiftDragging = value
  }

  protected get isAltDragging() {
    return this._isAltDragging
  }

  protected set isAltDragging(value) {
    this._isAltDragging = value
  }

  protected get animationId(): number | undefined {
    return this._animationId
  }

  protected set animationId(value: number | undefined) {
    this._animationId = value
  }

  protected get fillStyle() {
    return this._fillStyle
  }

  protected set fillStyle(value) {
    this._fillStyle = value
  }

  protected get startPoint(): Point | undefined {
    return this._startPoint
  }

  protected set startPoint(value: Point | undefined) {
    this._startPoint = value
    console.log('set startPoint', value)
  }

  protected get canvasStartPoint(): Point | undefined {
    return this._canvasStartPoint
  }

  protected set canvasStartPoint(value: Point | undefined) {
    this._canvasStartPoint = value
  }

  protected get selectedPanelId(): string | undefined {
    return this._selectedPanelId
  }

  protected set selectedPanelId(value: string | undefined) {
    this._selectedPanelId = value
  }

  runEventsOutsideAngular = false
}