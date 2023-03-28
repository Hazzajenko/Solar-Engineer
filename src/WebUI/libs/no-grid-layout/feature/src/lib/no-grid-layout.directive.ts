import { Directive, ElementRef, inject, NgZone, OnInit, Renderer2 } from '@angular/core'
import tippy from 'tippy.js'
import { FreePanelModel } from '@no-grid-layout/feature'
import { NoGridLayoutService } from './no-grid-layout.service'
import { getGuid } from '@shared/utils'

@Directive({
  selector: '[appNoGridLayoutDirective]',
  standalone: true,
})
export class NoGridLayoutDirective implements OnInit {
  private elementRef = inject(ElementRef<HTMLDivElement>)
  private renderer = inject(Renderer2)
  private noGridLayoutService = inject(NoGridLayoutService)
  private clickTimeout: NodeJS.Timeout | undefined
  private canvas!: HTMLCanvasElement
  private ctx!: CanvasRenderingContext2D
  runEventsOutsideAngular = false
  isDragging = false

  constructor(private readonly ngZone: NgZone) {
  }

  ngOnInit() {
    if (this.runEventsOutsideAngular) {
      this.ngZone.runOutsideAngular(() => {
        this.setupMouseEventListeners()
      })
    } else {
      this.setupMouseEventListeners()
    }
    this.setupCanvas()
  }

  private setupCanvas() {
    this.canvas = this.renderer.createElement('canvas')
    this.renderer.appendChild(this.elementRef.nativeElement, this.canvas)
    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Could not get canvas context')
    }
    this.ctx = ctx
    this.canvas.style.position = 'absolute'
    this.canvas.style.top = '0'
    this.canvas.style.left = '0'
    this.canvas.style.zIndex = '100'
    this.canvas.style.pointerEvents = 'none'
    this.canvas.width = this.elementRef.nativeElement.offsetWidth
    this.canvas.height = this.elementRef.nativeElement.offsetHeight
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private setupMouseEventListeners() {
    /*    this.renderer.listen(this.elementRef.nativeElement, 'click', (event: MouseEvent) => {
     event.stopPropagation()
     event.preventDefault()
     this.handleClickEvent(event)
     })*/
    this.renderer.listen(this.elementRef.nativeElement, 'mouseup', (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onMouseUpHandler(event)
    })
    this.renderer.listen(this.elementRef.nativeElement, 'mousedown', (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onMouseDownHandler(event)
    })
    this.renderer.listen(this.elementRef.nativeElement, 'mousemove', (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      this.onMouseMoveHandler(event)
    })
    /*this.ngZone.runOutsideAngular(() => {
     /!*      this.renderer.listen(this.elementRef.nativeElement, 'mousedown', (event: MouseEvent) => {
     event.stopPropagation()
     event.preventDefault()
     this.onMouseDownHandler(event)
     })
     this.renderer.listen(this.elementRef.nativeElement, 'mouseup', (event: MouseEvent) => {
     event.stopPropagation()
     event.preventDefault()
     this.onMouseUpHandler(event)
     })
     this.renderer.listen(this.elementRef.nativeElement, 'mousemove', (event: MouseEvent) => {
     event.stopPropagation()
     event.preventDefault()
     this.onMouseMoveHandler(event)
     })*!/
     /!*     this.renderer.listen(this.elementRef.nativeElement, 'click', (event: MouseEvent) => {
     event.stopPropagation()
     event.preventDefault()
     this.handleClickEvent(event)
     })*!/
     /!*    this.renderer.listen(this.elementRef.nativeElement, 'dblclick', (event: MouseEvent) => {
     event.stopPropagation()
     event.preventDefault()
     this.handleDoubleClickEvent(event)
     })*!/
     })*/
  }

  private onMouseMoveHandler(event: MouseEvent) {
    event.stopPropagation()
    event.preventDefault()
    // console.log('mousemove', event)
    // this.isDragging = true
    return
  }

  private onMouseUpHandler(event: MouseEvent) {
    event.stopPropagation()
    event.preventDefault()
    console.log('mouseup', event)
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout)
      console.log('Button clicked')
      this.handleClickEvent(event)
    } else {
      console.log('Button dragged')
      // handle the click event
    }
    return
    /*    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
     this.startX = undefined
     this.startY = undefined
     if (this.isDragging || event.ctrlKey) {
     this.isDragging = false
     this.elementRef.nativeElement.style.cursor = ''
     return
     }

     const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
     if (!location) return
     return this.mouseService.mouse({ event, location })*/
  }

  private onMouseDownHandler(event: MouseEvent) {
    event.stopPropagation()
    event.preventDefault()
    console.log('mousedown', event)
    this.isDragging = true
    this.clickTimeout = setTimeout(() => {
      this.clickTimeout = undefined
    }, 300)
    return
    /*    if (event.ctrlKey || event.button === 1) {
     /!*   const rect = this.elementRef.nativeElement.getBoundingClientRect()
     this.startX = event.clientX - rect.left
     this.startY = event.clientY - rect.top*!/
     this.isDragging = true
     /!*      if (event.button === 1) {
     this.middleClickDown = true
     }*!/
     return
     }
     if (event.altKey) {
     /!*      this.altKeyDragging = true
     if (!event.pageX || !event.pageY) {
     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
     this.startX = undefined
     this.startY = undefined
     return
     }

     const rect = this.canvas.getBoundingClientRect()

     this.startX = event.pageX - rect.left
     this.startY = event.pageY - rect.top*!/
     }

     this.isDragging = false*/
    // this.middleClickDown = false
    // const clientX = event.clientX
    // const clientY = event.clientY

    /*    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
     if (!location) return*/

    // return this.mouseService.mouse({ event, location })
  }

  private handleClickEvent(event: MouseEvent) {
    // event.stopPropagation()
    // event.preventDefault()
    // check if it is mouse up event
    // if (event.type === 'mouseup') return

    /*    const existingPanel = (event.composedPath()[0] as HTMLDivElement)
     console.log('existingPanel', existingPanel)*/

    // check if mouse is on a panel or not
    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
    console.log('location', location)
    if (location) return
    // check if it is a middle click
    if (event.button === 1) return
    // check if it is a right click
    if (event.button === 2) return
    // check if it is a ctrl click
    if (event.ctrlKey) return
    // check if it is a alt click
    if (event.altKey) return

    console.log('click')
    if (event.ctrlKey) return
    const rect = this.elementRef.nativeElement.getBoundingClientRect()
    const mouseX = event.pageX - rect.left
    const mouseY = event.pageY - rect.top

    // const length = this.noGridLayoutService.getLength()
    const freePanel: FreePanelModel = {
      id: getGuid(),
      location: {
        x: mouseX,
        y: mouseY,
      },
      /*      x: mouseX,
       y: mouseY,*/
    }

    console.log('clickEvent', event)
    this.noGridLayoutService.addFreePanel(freePanel)
    // console.log('freePanel', freePanel)
    /*    this.freePanels.push(freePanel,
     )
     this.freePanelsChange.emit(this.freePanels)*/
    /*    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
     if (location) {
     return this.clickService.click({ event: event as MouseEvent, location })
     }
     if (!location) {
     const secondDiv = (event.composedPath()[1] as HTMLDivElement).getAttribute('location')
     if (!secondDiv) return
     return this.clickService.click({ event: event as MouseEvent, location: secondDiv })
     }*/
    return
  }

  private setupTooltip() {
    tippy(this.elementRef.nativeElement, {
      // content: 'Bazinga!',
    })
  }
}
