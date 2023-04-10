import { Directive, ElementRef, inject, NgZone, OnInit, Renderer2 } from '@angular/core'
import { ContextMenuEvent, EventName, KEYS, MouseDownEvent, MouseMoveEvent, MouseUpEvent, POINTER_BUTTON, XyLocation } from '@shared/data-access/models'
import { CanvasPanel } from '../types/canvas-panel'

@Directive({
  selector:   '[appDesignCanvas]',
  standalone: true,
})
export class DesignCanvasDirective
  implements OnInit {

  private _canvas = inject(ElementRef<HTMLCanvasElement>).nativeElement
  private _ctx!: CanvasRenderingContext2D
  private _ngZone = inject(NgZone)
  private _renderer = inject(Renderer2)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private clickTimeout?: NodeJS.Timeout | undefined
  private _panels: CanvasPanel[] = []
  private _selectedPanel?: CanvasPanel
  private _animateScreenMoveId?: number

  mousePos!: HTMLDivElement
  transformedMousePos!: HTMLDivElement
  currentTransformedCursor: DOMPoint | undefined

  public get animateScreenMoveId(): number | undefined {
    return this._animateScreenMoveId
  }

  public set animateScreenMoveId(value: number | undefined) {
    this._animateScreenMoveId = value
    if (value) {
      console.log('set animateScreenMoveId', value)
    } else {
      console.log('animateScreenMoveId cancelled')
    }
  }

  public set panels(value: CanvasPanel[]) {
    this._panels = value
    console.log('set panels', value)
  }

  public get panels(): CanvasPanel[] {
    return this._panels
  }

  isDraggingEntity = false
  isDraggingScreen = false
  entityOnMouseDown?: CanvasPanel

  screenDragStartPoint: XyLocation = { x: 0, y: 0 }
  _scale = 1
  get scale(): number {
    return this._scale
  }

  set scale(value: number) {
    this._scale = value
    console.log('set scale', value)
  }

  _screenPosition: XyLocation = { x: 0, y: 0 }
  get screenPosition(): XyLocation {
    return this._screenPosition
  }

  set screenPosition(value: XyLocation) {
    this._screenPosition = value
    console.log('set screenPosition', value)
  }

  height = this._canvas.height
  width = this._canvas.width
  image: HTMLImageElement | undefined

  isHoveringEntity = false
  hoveringEntityId?: string

  public ngOnInit() {
    this.setupCanvas()
    this._ngZone.runOutsideAngular(() => {
      this.setupMouseEventListeners()
    })
    this.mousePos = document.getElementById('mouse-pos') as HTMLDivElement
    this.transformedMousePos = document.getElementById('transformed-mouse-pos') as HTMLDivElement
    console.log(this.mousePos, this.transformedMousePos)
  }

  private setupCanvas() {
    const ctx = this._canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Could not get canvas context')
    }
    this._ctx = ctx
    this._canvas.style.position = 'absolute'
    this._canvas.style.top = '0'
    this._canvas.style.left = '0'
    this._canvas.style.bottom = '0'
    this._canvas.style.right = '0'
    this._canvas.style.zIndex = '10'
    this._canvas.width = window.innerWidth
    this._canvas.height = window.innerHeight
    this._canvas.style.width = `${window.innerWidth}px`
    this._canvas.style.height = `${window.innerHeight}px`
    this._ctx.fillStyle = '#8ED6FF'
    this._ctx.lineWidth = 1
    this._ctx.strokeStyle = 'black'
  }

  private setupMouseEventListeners() {
    this._renderer.listen(this._canvas, MouseUpEvent, (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onMouseUpHandler(event)
      console.log('mouse up', event)
    })
    this._renderer.listen(this._canvas, MouseDownEvent, (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onMouseDownHandler(event)
      console.log('mouse down', event)
    })
    this._renderer.listen(this._canvas, MouseMoveEvent, (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onMouseMoveHandler(event)
      // console.log('mouse move', event)
    })
    this._renderer.listen(this._canvas, ContextMenuEvent, (event: PointerEvent) => {
      event.stopPropagation()
      event.preventDefault()
      console.log('context menu', event)
    })
    this._renderer.listen(this._canvas, EventName.Wheel, (event: WheelEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onScrollHandler(event)
      // console.log('wheel', event)
    })
    this._renderer.listen(window, EventName.KeyUp, (event: KeyboardEvent) => {
      event.stopPropagation()
      event.preventDefault()
      console.log('keyup menu', event)
      if (event.key === 'Delete') {
        this.panels = this.panels.filter(panel => panel !== this.entityOnMouseDown)
      }
      if (event.key === 'Escape') {
        this.panels = []
      }
      if (event.key === 'Enter') {
        this.panels = [...this.panels, CanvasPanel.create({ x: 100, y: 100 })]
      }
      if (event.key === KEYS.G) {
        this.drawPanels()
      }
    })
  }

  getTransformedPoint(x: number, y: number) {
    const originalPoint = new DOMPoint(x, y)
    return this._ctx.getTransform()
      .invertSelf()
      .transformPoint(originalPoint)
  }

  getTransformedPointToMiddleOfObject(x: number, y: number, width: number, height: number) {
    const originalPoint = new DOMPoint(x - width / 2, y - height / 2)
    return this._ctx.getTransform()
      .invertSelf()
      .transformPoint(originalPoint)
  }

  private onMouseDownHandler(event: MouseEvent) {
    console.log('mouse down', event)
    if (event.ctrlKey || event.button === POINTER_BUTTON.WHEEL) {
      this.isDraggingScreen = true
      console.log('dragging screen')
      this.screenDragStartPoint = this.getTransformedPoint(event.offsetX, event.offsetY)
      return
    }
    const clickedOnEntity = this._panels.find(panel => this.isMouseOverPanel(event, panel))
    if (clickedOnEntity) {
      console.log('clicked on entity', clickedOnEntity)
      this.entityOnMouseDown = clickedOnEntity
      if (this._selectedPanel?.id !== clickedOnEntity.id) {
        this._selectedPanel = undefined
      }
    }
    this.clickTimeout = setTimeout(() => {
      this.clickTimeout = undefined
    }, 300)
  }

  private onMouseUpHandler(event: MouseEvent) {
    if (event.button === POINTER_BUTTON.SECONDARY) return
    console.log('mouse up', event)
    if (this.isDraggingScreen) {
      this.isDraggingScreen = false
      if (this.animateScreenMoveId) {
        cancelAnimationFrame(this.animateScreenMoveId)
        this.animateScreenMoveId = undefined
      }
      console.log('screenPosition', this.screenPosition)
      return
    }
    if (this.isDraggingEntity) {
      this.isDraggingEntity = false
      console.log('entityOnMouseDown', this.entityOnMouseDown)
      if (this.entityOnMouseDown) {
        const location = this.getTransformedPointToMiddleOfObject(event.offsetX, event.offsetY, this.entityOnMouseDown.width, this.entityOnMouseDown.height)
        this.entityOnMouseDown = CanvasPanel.updateLocation(this.entityOnMouseDown, location)
        // this.entityOnMouseDown = CanvasPanel.updateLocationFromEventToScale(this.entityOnMouseDown, event, this.screenPosition, this.scale)
        this.updatePanel(this.entityOnMouseDown)
        this.entityOnMouseDown = undefined
      }
      return
    }
    this.isDraggingEntity = false
    this.isDraggingScreen = false
    this.entityOnMouseDown = undefined
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout)
      this.clickTimeout = undefined
      this.handleClick(event)
    }
  }

  private handleClick(event: MouseEvent) {
    console.log('click', event)
    const isPanel = this._panels.find(panel => this.isMouseOverPanel(event, panel))
    if (isPanel) {
      this.selectPanel(isPanel)
      return
    }
    this._selectedPanel = undefined
    const location = this.getTransformedPoint(event.offsetX, event.offsetY)
    const panel = CanvasPanel.create(location)

    this.panels = [...this.panels, panel]

    this.drawPanels()
  }

  private onScrollHandler(event: WheelEvent) {
    const currentTransformedCursor = this.getTransformedPoint(event.offsetX, event.offsetY)

    const zoom = event.deltaY < 0
      ? 1.1
      : 0.9

    this._ctx.translate(currentTransformedCursor.x, currentTransformedCursor.y)
    this._ctx.scale(zoom, zoom)
    this._ctx.translate(-currentTransformedCursor.x, -currentTransformedCursor.y)

    this.drawPanels()

    event.preventDefault()
  }

  private selectPanel(panel: CanvasPanel) {
    this._selectedPanel = panel
    console.log('selected panel', panel)
    this.drawPanels()
  }

  private onMouseMoveHandler(event: MouseEvent) {
    this.currentTransformedCursor = this.getTransformedPoint(event.offsetX, event.offsetY)
    this.mousePos.innerText = `Original X: ${event.offsetX}, Y: ${event.offsetY}`
    this.transformedMousePos.innerText = `Transformed X: ${this.currentTransformedCursor.x}, Y: ${this.currentTransformedCursor.y}`
    if (this.isDraggingScreen) {
      if (event.ctrlKey || event.buttons === 4) {
        this._ctx.translate(this.currentTransformedCursor.x - this.screenDragStartPoint.x, this.currentTransformedCursor.y - this.screenDragStartPoint.y)
        this.drawPanels()
      }
      return
    }
    if (this.entityOnMouseDown) {
      this.isDraggingEntity = true
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
      const location = this.getTransformedPointToMiddleOfObject(event.offsetX, event.offsetY, this.entityOnMouseDown.width, this.entityOnMouseDown.height)
      this.entityOnMouseDown = {
        ...this.entityOnMouseDown,
        location: {
          x: location.x,
          y: location.y,
        },
      }
      this.updatePanel(this.entityOnMouseDown)
    }

    const isPanel = this._panels.find(panel => this.isMouseOverPanel(event, panel))
    if (isPanel) {

      this._canvas.style.cursor = 'pointer'
      this.hoveringEntityId = isPanel.id
      this.drawPanels()
      return
    } else {
      if (this.hoveringEntityId) {
        this.hoveringEntityId = undefined
        this.drawPanels()
      }
      this._canvas.style.cursor = 'default'

    }

  }

  private animateScreenMove() {
    this.drawPanels()
    this.animateScreenMoveId = requestAnimationFrame(() => this.animateScreenMove())
  }

  private isMouseOverPanel(event: MouseEvent, panel: CanvasPanel) {
    // const { x, y } = getXyPointFromEvent(event, this.screenPosition, this.scale)
    const { x, y } = this.getTransformedPoint(event.offsetX, event.offsetY)
    const { location, width, height } = panel
    return x >= location.x && x <= location.x + width && y >= location.y && y <= location.y + height
  }

  private drawPanel(panel: CanvasPanel) {

    if (this.hoveringEntityId === panel.id) {
      this._ctx.closePath()
      this._ctx.fillStyle = '#17fff3'
    }

    if (this._selectedPanel && this._selectedPanel.id === panel.id) {
      this._ctx.closePath()
      this._ctx.fillStyle = '#ff6e78'
    }

    // const { x, y } = getXyPointFromLocationV2(panel.location, this.screenPosition, this.scale)
    // this._ctx.rect(x, y, panel.width * this.scale, panel.height * this.scale)
    this._ctx.rect(panel.location.x, panel.location.y, panel.width, panel.height)

    this._ctx.fill()
    this._ctx.stroke()
    this._ctx.beginPath()
    this._ctx.fillStyle = '#8ED6FF'

  }

  private drawPanels() {
    this._ctx.save()
    this._ctx.setTransform(1, 0, 0, 1, 0, 0)
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
    this._ctx.restore()
    this._ctx.beginPath()
    this._panels.forEach(panel => {
      this.drawPanel(panel)
    })
    this._ctx.closePath()
  }

  private updatePanel(panel: CanvasPanel) {
    const findIndex = this._panels.findIndex(p => p.id === panel.id)
    this._panels[findIndex] = panel
    this.drawPanels()
  }
}
