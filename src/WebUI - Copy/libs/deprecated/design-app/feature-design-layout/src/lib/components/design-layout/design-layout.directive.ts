import { DynamicComponentDirective } from '../../directives/dynamic-component.directive'
import { DesignLayoutService } from './design-layout.service'
import { ContentChildren, Directive, ElementRef, inject, OnInit } from '@angular/core'
import {
	ContextMenuEvent,
	MouseDownEvent,
	MouseMoveEvent,
	MouseUpEvent,
} from '@shared/data-access/models'
import { CANVAS } from 'deprecated/design-app/canvas'

@Directive({
	selector: '[appDesignLayout]',
	standalone: true,
	queries: {
		dynamicComponents: new ContentChildren(DynamicComponentDirective),
	},
})
export class DesignLayoutDirective extends DesignLayoutService implements OnInit {
	private _element = inject(ElementRef<HTMLDivElement>).nativeElement
	private _parentElement: HTMLDivElement = this._element.parentElement as HTMLDivElement
	private _scrollElement: HTMLDivElement = this._element.children[0] as HTMLDivElement
	// @ContentChildren(DynamicComponentDirective) _dynamicComponents!: QueryList<DynamicComponentDirective>
	height = 0
	width = 0
	negativeHeight = 0
	negativeWidth = 0
	toggleCheck = false

	set dynamicComponents(dynamicComponents: any) {
		// this._dynamicComponents = dynamicComponents
		console.log('set this._dynamicComponents', dynamicComponents)
	}

	ngOnInit() {
		if (this.runEventsOutsideAngular) {
			this._ngZone.runOutsideAngular(() => {
				this.setupMouseEventListeners()
			})
		} else {
			this.setupMouseEventListeners()
		}
		this.initElements()
	}

	private initElements() {
		const { layoutHeight, layoutWidth } = this.calculateStandardGridSize()
		this.setupParentElement()
		this.setupGridElement(layoutWidth, layoutHeight)
		this.setupCanvas()
		this.setupElements()
		// console.log(this._scrollElement)
		this.setupChildElement(layoutWidth, layoutHeight)
		this.distributeElement()
	}

	private calculateStandardGridSize() {
		const blockHeight = 32
		const blockWidth = 32
		const rows = Math.floor((window.innerHeight - 100) / blockHeight)
		const cols = Math.floor((window.innerWidth - 100) / blockWidth)
		const layoutHeight = rows * blockHeight
		const layoutWidth = cols * blockWidth
		return { layoutHeight, layoutWidth }
	}

	private setupParentElement() {
		this._renderer.setStyle(this._element.parentElement, 'height', `${window.innerHeight}px`)
		this._renderer.setStyle(this._element.parentElement, 'width', `${window.innerWidth}px`)
		/*    this._renderer.setStyle(this._element.parentElement, 'height', '100%')
     this._renderer.setStyle(this._element.parentElement, 'minHeight', '100%')
     this._renderer.setStyle(this._element.parentElement, 'width', '100%')
     this._renderer.setStyle(this._element.parentElement, 'minWidth', '100%')*/
		this._renderer.setStyle(this._element.parentElement, 'top', 0)
		this._renderer.setStyle(this._element.parentElement, 'left', 0)
		this._renderer.setStyle(this._element.parentElement, 'bottom', 0)
		this._renderer.setStyle(this._element.parentElement, 'right', 0)
		this._renderer.setStyle(this._element.parentElement, 'position', 'absolute')
		this._renderer.setStyle(this._element.parentElement, 'overflow', 'hidden')

		console.log('parentElement', this._element.parentElement)
	}

	private setupGridElement(layoutWidth: number, layoutHeight: number) {
		this._renderer.setStyle(this._element, 'width', `${layoutWidth}px`)
		this._renderer.setStyle(this._element, 'height', `${layoutHeight}px`)
		this._renderer.setStyle(this._element, 'position', 'relative')

		/*    const left = (window.innerWidth - layoutWidth) / 2
     const top = (window.innerHeight - layoutHeight) / 2
     this._renderer.setStyle(this._scrollElement, 'left', `${left}px`)
     this._renderer.setStyle(this._scrollElement, 'top', `${top}px`)*/
	}

	private distributeElement() {
		this._mousePositioningService.gridLayoutElement = this._element
		this._viewPositioningService.gridLayoutElement = this._element
		this._viewPositioningService.scrollElement = this._scrollElement
		this._mousePositioningService.scrollElement = this._scrollElement
		this._componentElementsService.parentElement = this._parentElement
		this._componentElementsService.gridLayoutElement = this._element
		// this._componentElementsService.scrollElement = this._scrollElement
		this._componentElementsService.canvasElement = this.canvas
		this._componentElementsService.canvasCtx = this.ctx
	}

	private setupCanvas() {
		this.canvas = this._renderer.createElement(CANVAS)
		this._renderer.appendChild(this._element.parentElement, this.canvas)
		const ctx = this.canvas.getContext('2d')
		if (!ctx) {
			throw new Error('Could not get canvas context')
		}
		this.canvas.style.position = 'absolute'
		this.canvas.style.top = '0'
		this.canvas.style.left = '0'
		this.canvas.style.zIndex = '100'
		this.canvas.style.pointerEvents = 'none'
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		this.ctx = ctx
		this._renderer.setStyle(this.canvas, 'height', `${window.innerHeight}px`)
		this._renderer.setStyle(this.canvas, 'width', `${window.innerWidth}px`)
		this._renderer.setStyle(this.canvas, 'position', 'absolute')
		this._renderer.setStyle(this.canvas, 'zIndex', 10)
		this._renderer.setStyle(this.canvas, 'top', 0)
		this._renderer.setStyle(this.canvas, 'left', 0)
		this._renderer.setStyle(this.canvas, 'bottom', 0)
		this._renderer.setStyle(this.canvas, 'right', 0)
	}

	private setupChildElement(layoutWidth: number, layoutHeight: number) {
		this._scrollElement = this._element.children[0]
		// this._renderer.setStyle(this._scrollElement, 'position', 'relative')
		this._renderer.setStyle(this._scrollElement, 'position', 'absolute')
		// this._renderer.setStyle(this._scrollElement, 'overflow', 'hidden')
		// this._renderer.setStyle(this._scrollElement, 'zIndex', 1)
		/*    layoutWidth = layoutWidth * 1.5
     layoutHeight = layoutHeight * 1.5*/
		layoutWidth = layoutWidth * 2
		layoutHeight = layoutHeight * 2
		this._renderer.setStyle(this._scrollElement, 'width', `${layoutWidth}px`)
		this._renderer.setStyle(this._scrollElement, 'height', `${layoutHeight}px`)
		const left = (window.innerWidth - layoutWidth) / 2
		const top = (window.innerHeight - layoutHeight) / 2
		this._renderer.setStyle(this._scrollElement, 'left', `${left}px`)
		this._renderer.setStyle(this._scrollElement, 'top', `${top}px`)
		this._renderer.setStyle(this._scrollElement, 'display', 'block')
	}

	private setupElements() {
		this.height = Number(this._element.style.height.split('p')[0])
		this.negativeHeight = Number(this._element.style.height.split('p')[0]) * -1
		this.width = Number(this._element.style.width.split('p')[0])
		this.negativeWidth = Number(this._element.style.width.split('p')[0]) * -1
	}

	private setupMouseEventListeners() {
		this._renderer.listen(this._element, MouseUpEvent, (event: MouseEvent) => {
			event.stopPropagation()
			event.preventDefault()
			this.onMouseUpHandler(event)
		})
		this._renderer.listen(this._element, MouseDownEvent, (event: MouseEvent) => {
			event.stopPropagation()
			event.preventDefault()
			this.onMouseDownHandler(event)
		})
		this._renderer.listen(this._element, MouseMoveEvent, (event: MouseEvent) => {
			event.stopPropagation()
			event.preventDefault()
			this.onMouseMoveHandler(event)
		})
		this._renderer.listen(this._element, ContextMenuEvent, (event: PointerEvent) => {
			event.stopPropagation()
			event.preventDefault()
			return
		})
		/*    this._renderer.listen(this._element, ContextMenuEvent, (event: PointerEvent) => {
     event.stopPropagation()
     event.preventDefault()
     console.log('context menu', event)
     this._clickService.handleContextMenuEvent(event)
     })*/
		/*    this._renderer.listen(this._element, 'wheel', (event: WheelEvent) => {
     event.stopPropagation()
     event.preventDefault()
     this._viewPositioningService.onScrollHandler(event)
     })*/
	}

	private onMouseDownHandler(event: MouseEvent) {
		// this._clickService.handleOpenMenus(event)
		this.isDragging = true
		/**
		 * If the user is holding down the ctrl key, then we want to start a drag
		 */
		if (event.ctrlKey || event.button === 1) {
			this._viewPositioningService.onMouseDownHelper(event)
			this.toggleCheck = true
			this.isDragging = false
			this.isScreenDragging = true
			return
		}
		if (event.altKey) {
			const x = event.pageX - this._element.offsetLeft * this.scale
			const y = event.pageY - this._element.offsetTop * this.scale
			this.canvasStartPoint = { x, y }

			// this._multiSelectService.startMultiSelectionBox(this.canvasStartPoint)
			this._selectedFacade.dispatch.startMultiSelectionBox(this.canvasStartPoint)
			this.isDragging = false
			this.isAltDragging = true
			return
		}

		const panelId = (event.composedPath()[0] as HTMLDivElement).getAttribute('panelId')
		if (panelId) {
			this.selectedPanelId = panelId
		}
		this.clickTimeout = setTimeout(() => {
			this.clickTimeout = undefined
		}, 300)
		return
	}

	private onMouseUpHandler(event: MouseEvent) {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId)
		}
		if (this.isScreenDragging) {
			this.isScreenDragging = false
			this.startPoint = undefined
			return
		}
		if (this.isAltDragging) {
			this.isAltDragging = false
			if (!this.canvasStartPoint) {
				throw new Error('Canvas start point is undefined')
			}
			const x = event.pageX - this._element.offsetLeft * this.scale
			const y = event.pageY - this._element.offsetTop * this.scale
			const entitiesInSelectionBox = this._objectPositioningService.getAllElementsBetweenTwoPoints(
				this.canvasStartPoint,
				{ x, y },
			)
			this._selectedFacade.dispatch.stopMultiSelectedBox(entitiesInSelectionBox)
			this.canvasStartPoint = undefined
			// this._multiSelectService.stopMultiSelectionBox({ x, y })
			return
		}
		this.selectedPanelId = undefined
		this.isDragging = false

		this.clearCtxRect()
		if (this.clickTimeout) {
			clearTimeout(this.clickTimeout)
			// cancel right click
			if (event.button === 2) return
			this._clickService.handleClickEvent(event)
		} else {
			this._viewPositioningService.ctrlMouseDownStartPoint = undefined
		}
		return
	}

	private onMouseMoveHandler(event: MouseEvent) {
		if (this.isScreenDragging) {
			// console.log(event)
			if (event.ctrlKey || event.buttons === 4) {
				this._viewPositioningService.onCtrlMouseMoveHelper(event)
				return
			}
			this.isScreenDragging = false
			this.startPoint = undefined
			return
		}
		if (this.isAltDragging) {
			if (!event.altKey || !this.canvasStartPoint) {
				this.isAltDragging = false
				this.canvasStartPoint = undefined
				return
			} else {
				this.pagePoint = {
					x: event.pageX,
					y: event.pageY,
				}
			}
			this._ngZone.runOutsideAngular(() => {
				this.animateSelectionBox(event)
			})
			return
		}
		if (!this.isDragging || !this.selectedPanelId) {
			return
		}
		const panelId = (event.composedPath()[0] as HTMLDivElement).getAttribute('panelId')
		if (!panelId) return

		this.selectedPanelId = panelId
		this.pagePoint = {
			x: event.pageX,
			y: event.pageY,
		}
		this._ngZone.runOutsideAngular(() => {
			this._canvasService.drawLinesForBlocks(panelId)
		})

		return
	}

	private animateSelectionBox(event: MouseEvent) {
		this.clearCtxRect()
		if (!this.canvasStartPoint || !this.pagePoint) {
			return
		}
		const x = event.pageX - this._element.offsetLeft * this.scale
		const y = event.pageY - this._element.offsetTop * this.scale

		const mousePointToScale = { x, y }
		const width = mousePointToScale.x - this.canvasStartPoint.x
		const height = mousePointToScale.y - this.canvasStartPoint.y

		this.ctx.globalAlpha = 0.4
		this.ctx.fillStyle = this.fillStyle
		this.ctx.fillRect(this.canvasStartPoint.x, this.canvasStartPoint.y, width, height)
		this.ctx.globalAlpha = 1.0

		requestAnimationFrame(() => this.animateSelectionBox(event))
	}

	private clearCtxRect() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	/*  onCtrlMouseMoveHelper(event: MouseEvent) {
   // if (!this._ctrlMouseDownStartPoint) return
   // const rect = this.gridLayoutElement.getBoundingClientRect()
   const rect = this._element.getBoundingClientRect()
   const parentRect = this._componentElementsService.parentElement.getBoundingClientRect()
   const x =
   event.pageX -
   (parentRect.width - rect.width) / 2

   const y =
   event.pageY -
   (parentRect.height - rect.height) / 2

   const top = y - this._ctrlMouseDownStartPoint.y
   const left = x - this._ctrlMouseDownStartPoint.x

   this._renderer.setStyle(this._componentElementsService.gridLayoutElement, 'top', top + 'px')
   this._renderer.setStyle(this._componentElementsService.gridLayoutElement, 'left', left + 'px')

   const canvasTop = top + this._componentElementsService.canvasElement.offsetTop
   const canvasLeft = left + this._componentElementsService.canvasElement.offsetLeft

   console.log('canvasTop', canvasTop)
   console.log('canvasLeft', canvasLeft)

   // this._renderer.setStyle(this._componentElementsService.canvasElement, 'top', canvasTop + 'px')
   // this._renderer.setStyle(this._componentElementsService.canvasElement, 'left', canvasLeft + 'px')
   /!*    this._renderer.setStyle(this._componentElementsService.canvasElement, 'top', '50%')
   this._renderer.setStyle(this._componentElementsService.canvasElement, 'left', '50%')
   this._renderer.setStyle(this._componentElementsService.canvasElement, 'transform', `translate(-50%, -50%)`)*!/
   }*/
}
