// import { Logger } from '@ngrx/data'
import { DesignLayoutClickService } from '../../services/design-layout-click.service'
import { inject, NgZone, Renderer2 } from '@angular/core'
import {
	ComponentElementsService,
	MousePositioningService,
	ObjectPositioningService,
	ViewPositioningService,
} from '@design-app/utils'
import { Point } from '@shared/data-access/models'
import { CanvasService } from 'deprecated/design-app/canvas'
import { SelectedStoreService } from 'deprecated/design-app/feature-selected'

export class DesignLayoutService {
	protected _viewPositioningService = inject(ViewPositioningService)
	protected _renderer = inject(Renderer2)
	protected _clickService = inject(DesignLayoutClickService)
	protected _canvasService = inject(CanvasService)
	protected _mousePositioningService = inject(MousePositioningService)
	protected _componentElementsService = inject(ComponentElementsService)
	protected _objectPositioningService = inject(ObjectPositioningService)
	// protected _multiSelectService = inject(MultiSelectService)
	protected _selectedFacade = inject(SelectedStoreService)
	protected _ngZone: NgZone = inject(NgZone)
	private _canvas!: HTMLCanvasElement
	private _ctx!: CanvasRenderingContext2D
	private _clickTimeout: NodeJS.Timeout | undefined
	private _pagePoint: Point | undefined
	private _scale = 1
	private _screenPosition: Point = { x: 0, y: 0 }
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

	protected get pagePoint(): Point | undefined {
		return this._pagePoint
	}

	protected set pagePoint(value: Point | undefined) {
		this._pagePoint = value
		// console.log('set pagePoint', value)
	}

	protected get scale() {
		return this._scale
	}

	protected set scale(value) {
		this._scale = value
		this._mousePositioningService.scale = value
	}

	protected set screenProperties(options: { scale: number; screenPosition: Point }) {
		this.scale = options.scale
		this.screenPosition = options.screenPosition
	}

	protected get screenPosition(): Point {
		return this._screenPosition
	}

	protected set screenPosition(value: Point) {
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
