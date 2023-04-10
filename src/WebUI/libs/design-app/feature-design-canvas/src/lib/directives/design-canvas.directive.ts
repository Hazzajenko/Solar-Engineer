import { Directive, ElementRef, inject, NgZone, OnInit, Renderer2 } from '@angular/core'
import { ContextMenuEvent, KEYS, MouseDownEvent, MouseMoveEvent, MouseUpEvent, XyLocation } from '@shared/data-access/models'
import { CanvasPanel } from '../types/canvas-panel'
import { getXyPointFromEvent, getXyPointFromLocationV2 } from '../functions'
import { GridConfig } from 'design-app/utils'

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
  scale = 1
  screenPosition: XyLocation = { x: 0, y: 0 }

  public ngOnInit() {
    this.setupCanvas()
    this._ngZone.runOutsideAngular(() => {
      this.setupMouseEventListeners()
    })
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
    this._renderer.listen(this._canvas, 'wheel', (event: WheelEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onScrollHandler(event)
      console.log('wheel', event)
    })
    this._renderer.listen(window, 'keyup', (event: KeyboardEvent) => {
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
    console.log('mouse down', event)
    if (event.ctrlKey) {
      this.isDraggingScreen = true
      console.log('dragging screen')
      // const canvasRect = this._canvas.getBoundingClientRect()
      // console.log('canvasRect', canvasRect)
      console.log('event', event.pageX, event.pageY)
      this.screenDragStartPoint = {
        x: event.pageX / this.scale - this.screenPosition.x,
        y: event.pageY / this.scale - this.screenPosition.y,
      }
      // this.screenDragStartPoint = { x: event.clientX, y: event.clientY }
      return
    }
    // this.isDraggingEntity = true
    const clickedOnEntity = this._panels.find(panel => this.isMouseOverPanel(event, panel))
    if (clickedOnEntity) {
      console.log('clicked on entity', clickedOnEntity)
      // this.isDraggingEntity = true
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
        this.entityOnMouseDown = CanvasPanel.updateLocationFromEventToScale(this.entityOnMouseDown, event, this.screenPosition, this.scale)
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
    const panel = CanvasPanel.createFromEventToScale(event, this.screenPosition, this.scale)

    this.panels = [...this.panels, panel]

    this.drawPanels()
  }

  private onScrollHandler(event: WheelEvent) {
    // event.stopPropagation()
    // event.preventDefault()
    const speed = GridConfig.Speed // 0.05
    const minScale = 0.5
    const maxScale = GridConfig.MaxScale // 2
    console.log('onScrollHandsler', event)
    const pointer = getXyPointFromEvent(event, this.screenPosition, this.scale)
    const pointerX = pointer.x
    const pointerY = pointer.y
    // const pointerX = event.pageX
    // const pointerY = event.pageY
    const targetX = (pointerX - this.screenPosition.x) / this.scale
    const targetY = (pointerY - this.screenPosition.y) / this.scale
    const sizeW = this._canvas.width
    const sizeH = this._canvas.height

    this.scale += -1 * Math.max(-1, Math.min(1, event.deltaY)) * speed * this.scale
    this.scale = Math.max(minScale, Math.min(maxScale, this.scale))
    this.screenPosition = {
      x: -targetX * this.scale + pointerX,
      y: -targetY * this.scale + pointerY,
    }

    if (this.screenPosition.x > 0) this.screenPosition.x = 0
    if (this.screenPosition.x + sizeW * this.scale < sizeW) this.screenPosition.x = -sizeW * (this.scale - 1)
    if (this.screenPosition.y > 0) this.screenPosition.y = 0
    if (this.screenPosition.y + sizeH * this.scale < sizeH) this.screenPosition.y = -sizeH * (this.scale - 1)
    // if (event.ctrlKey) {
    /*    this.scale += event.deltaY * 0.001
     this.scale = Math.max(this.scale, 0.1)
     this.scale = Math.min(this.scale, 10)
     console.log('scale', this.scale)
     this.screenPosition = {
     x: event.pageX / this.scale - this.screenPosition.x,
     y: event.pageY / this.scale - this.screenPosition.y,
     }*/
    this._ctx.setTransform()
    this._ctx.translate(this.screenPosition.x, this.screenPosition.y)
    this._ctx.scale(this.scale, this.scale)

    this.drawPanels()
    // }
  }

  private selectPanel(panel: CanvasPanel) {
    this._selectedPanel = panel
    console.log('selected panel', panel)
    this.drawPanels()
  }

  private onMouseMoveHandler(event: MouseEvent) {
    if (this.isDraggingScreen) {
      this.screenPosition = {
        x: event.pageX / this.scale - this.screenDragStartPoint.x,
        y: event.pageY / this.scale - this.screenDragStartPoint.y,
      }
      if (this._animateScreenMoveId) return
      this.animateScreenMove()
      return

      // console.log('screenPosition', this.screenPosition)
      // this._ctx.setTransform()
      // const transform = this._ctx.getTransform()
      // this._ctx.get
      // console.log('transform', transform)

      // this._ctx.translate(this.screenPosition.x, this.screenPosition.y)
      // this._ctx.scale(this.scale, this.scale)
      // this.drawPanels()

    }
    /*    if (!this.isDraggingEntity) {
     return
     }*/
    if (this.entityOnMouseDown) {
      this.isDraggingEntity = true
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
      console.log('dragging', this.entityOnMouseDown)
      // const { x, y } = event
      // const { location } = this.entityOnMouseDown
      // const deltaX = x - location.x
      // const deltaY = y - location.y
      // this.entityOnMouseDown.location = { x, y }
      this.entityOnMouseDown = CanvasPanel.updateLocationFromEventToScale(this.entityOnMouseDown, event, this.screenPosition, this.scale)
      this.updatePanel(this.entityOnMouseDown)
      // this.animateMove.animate()

      /*      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
       this._panels.forEach(panel => {
       this.drawPanel(panel)
       })*/
    }

  }

  private animateScreenMove() {
    this.drawPanels()
    this.animateScreenMoveId = requestAnimationFrame(() => this.animateScreenMove())
  }

  private isMouseOverPanel(event: MouseEvent, panel: CanvasPanel) {
    const { x, y } = getXyPointFromEvent(event, this.screenPosition, this.scale)
    const { location, width, height } = panel
    return x >= location.x && x <= location.x + width && y >= location.y && y <= location.y + height
  }

  private drawPanel(panel: CanvasPanel) {
    if (this._selectedPanel && this._selectedPanel.id === panel.id) {
      this._ctx.closePath()
      this._ctx.fillStyle = '#ff6e78'
    }
    const { x, y } = getXyPointFromLocationV2(panel.location, this.screenPosition, this.scale)
    this._ctx.rect(x, y, panel.width * this.scale, panel.height * this.scale)
    this._ctx.fill()
    this._ctx.stroke()
    this._ctx.beginPath()
    this._ctx.fillStyle = '#8ED6FF'
  }

  private drawPanels() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
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
    /*    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
     this.drawPanel(panel)*/
  }

  /*

   public ngAfterViewInit() {
   this._ngZone.runOutsideAngular(() => {
   this.drawPanels()
   })
   }

   public ngAfterViewChecked() {
   this._ngZone.runOutsideAngular(() => {
   this.drawPanels()
   })
   }
   */

  /*  public ngOnDestroy() {
   this._renderer.removeChild(this._element, this._canvas)
   }*/

  /*trackTransforms(ctx: CanvasRenderingContext2D) {
   const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
   const xform = svg.createSVGMatrix();
   ctx.getTransform = function () {
   return xform;
   };

   const savedTransforms = [];
   const save = ctx.save;
   ctx.save = function () {
   savedTransforms.push(xform.translate(0, 0));
   return save.call(ctx);
   };

   const restore = ctx.restore;
   ctx.restore = function () {
   xform = savedTransforms.pop();
   return restore.call(ctx);
   };

   const scale = ctx.scale;
   ctx.scale = function (sx, sy) {
   xform = xform.scaleNonUniform(sx, sy);
   return scale.call(ctx, sx, sy);
   };

   const rotate = ctx.rotate;
   ctx.rotate = function (radians) {
   xform = xform.rotate((radians * 180) / Math.PI);
   return rotate.call(ctx, radians);
   };

   const translate = ctx.translate;
   ctx.translate = function (dx, dy) {
   xform = xform.translate(dx, dy);
   return translate.call(ctx, dx, dy);
   };

   const transform = ctx.transform;
   ctx.transform = function (a, b, c, d, e, f) {
   const m2 = svg.createSVGMatrix();
   m2.a = a;
   m2.b = b;
   m2.c = c;
   m2.d = d;
   m2.e = e;
   m2.f = f;
   xform = xform.multiply(m2);
   return transform.call(ctx, a, b, c, d, e, f);
   };

   const setTransform = ctx.setTransform;
   ctx.setTransform = function (a, b, c, d, e, f) {
   xform.a = a;
   xform.b = b;
   xform.c = c;
   xform.d = d;
   xform.e = e;
   xform.f = f;
   return setTransform.call(ctx, a, b, c, d, e, f);
   };

   const pt = svg.createSVGPoint();
   ctx.transformedPoint = function (x, y) {
   pt.x = x;
   pt.y = y;
   return pt.matrixTransform(xform.inverse());
   };
   }*/

}
