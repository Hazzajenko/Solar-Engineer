import {
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core'

import {
  ClickService,
  ClientXY,
  DoubleClickService,
  MouseService,
  MultiStoreService,
  XYModel,
} from '@grid-layout/data-access'
import { BaseService } from '@shared/logger'

@Directive({
  selector: '[appWrapper]',
  standalone: true,
})
export class WrapperDirective extends BaseService implements OnInit {
  private multiStore = inject(MultiStoreService)

  private elementRef = inject(ElementRef<HTMLDivElement>)
  private renderer = inject(Renderer2)
  // private uiRepository = inject(UiRepository)
  // private canvasDirective = inject(CanvasDirective)
  private mouseService = inject(MouseService)
  private clickService = inject(ClickService)
  private doubleClickService = inject(DoubleClickService)
  canvas!: HTMLCanvasElement
  // canvas!: ElementRef<HTMLCanvasElement>
  ctx!: CanvasRenderingContext2D

  scale = 1
  pageX?: number
  pageY?: number
  startX?: number
  startY?: number
  isDragging = false
  altKeyDragging = false

  height!: number
  negativeHeight!: number

  width!: number
  negativeWidth!: number
  middleClickDown = false
  fillStyle = '#7585d8'

  constructor(private ngZone: NgZone) {
    super()
  }

  @Output() clientXY: EventEmitter<ClientXY> = new EventEmitter<ClientXY>()
  @Output() pageXY: EventEmitter<XYModel> = new EventEmitter<XYModel>()
  @Output() resetKeyUp: EventEmitter<string> = new EventEmitter<string>()

  @Input() set setScale(scale: number | null) {
    if (!scale) return
    if (scale < this.scale) {
      this.elementRef.nativeElement.style.top = '0px'
      this.elementRef.nativeElement.style.left = '0px'
    }
    this.scale = scale
  }

  @Input() set keyUp(keyUp: string | null) {
    if (!keyUp) return
    switch (keyUp) {
      case 'r': {
        this.elementRef.nativeElement.style.top = '0px'
        this.elementRef.nativeElement.style.left = '0px'
        break
      }
      case 'Control': {
        // console.log('CONTROL')
        this.isDragging = false
        this.multiStore.dispatch.clearMultiState()
        this.elementRef.nativeElement.style.cursor = ''
        break
      }
    }
    this.resetKeyUp.emit('')
  }

  /*  @HostListener('document:mouseup', ['$event'])
    async mouseUp(event: MouseEvent) {
      event.preventDefault()
      event.stopPropagation()
      // console.log('MOUSEUP--WRAPPER', event)
      if (this.isDragging || event.ctrlKey) {
        this.isDragging = false
        this.elementRef.nativeElement.style.cursor = ''
        return
      }
      const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
      // console.log(location)
      if (!location) return
      return this.mouseService.mouse({ event, location })
    }*/

  private onMouseUpHandler(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    // console.log('MOUSEUP--WRAPPER', event)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.startX = undefined
    this.startY = undefined
    if (this.isDragging || event.ctrlKey) {
      this.isDragging = false
      this.elementRef.nativeElement.style.cursor = ''
      return
    }

    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
    // console.log(location)
    if (!location) return
    return this.mouseService.mouse({ event, location })
  }

  private onMouseDownHandler(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    // console.log('MOUSEDOWN--WRAPPER', event)
    if (event.ctrlKey /* || event.button === 1*/) {
      // console.log('MOUSEDOWN--WRAPPER', event)
      const rect = this.elementRef.nativeElement.getBoundingClientRect()
      this.startX = event.clientX - rect.left
      this.startY = event.clientY - rect.top
      this.isDragging = true
      /*      if (event.button === 1) {
              this.middleClickDown = true
            }*/
      return
    }
    if (event.altKey) {
      this.altKeyDragging = true
      if (!event.pageX || !event.pageY) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.startX = undefined
        this.startY = undefined
        return
      }

      const rect = this.canvas.getBoundingClientRect()

      this.startX = event.pageX - rect.left
      this.startY = event.pageY - rect.top
      // this.elementRef.nativeElement.style.cursor = 'grabbing'
      // return
    }
    /*    if (!event.altKey) {
          /!*      this.uiRepository.setClientXY({
                  clientX: undefined,
                  clientY: undefined,
                })*!/
          this.clientXY.emit({
            clientX: undefined,
            clientY: undefined,
          })
          return
        }*/
    this.isDragging = false
    this.middleClickDown = false
    const clientX = event.clientX
    const clientY = event.clientY
    /*    if (!event.pageX || !event.pageY) {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
          this.startX = undefined
          this.startY = undefined
          return
        }

        const rect = this.canvas.getBoundingClientRect()

        this.startX = event.pageX - rect.left
        this.startY = event.pageY - rect.top*/
    // this.handleCanvasEvents(event)
    /*    this.pageXY.emit({
          x: event.pageX,
          y: event.pageY,
        })
        this.clientXY.emit({
          clientX,
          clientY,
        })*/

    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
    if (!location) return
    // console.log(location)

    return this.mouseService.mouse({ event, location })
    // await this.mouseService.mouse({ event, location })
    // return
  }

  private handleCanvasEvents(event: MouseEvent) {
    if (!event.pageX || !event.pageY) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.startX = undefined
      this.startY = undefined
      return
    }

    const rect = this.canvas.getBoundingClientRect()

    this.startX = event.pageX - rect.left
    this.startY = event.pageY - rect.top
  }

  /*
    @HostListener('document:mousedown', ['$event'])
    async mouseDown(event: MouseEvent) {
      event.preventDefault()
      event.stopPropagation()
      // console.log('MOUSEDOWN--WRAPPER', event)
      if (event.ctrlKey /!* || event.button === 1*!/) {
        // console.log('MOUSEDOWN--WRAPPER', event)
        const rect = this.elementRef.nativeElement.getBoundingClientRect()
        this.startX = event.clientX - rect.left
        this.startY = event.clientY - rect.top
        this.isDragging = true
        /!*      if (event.button === 1) {
                this.middleClickDown = true
              }*!/
        return
      }
      if (!event.altKey) {
        /!*      this.uiRepository.setClientXY({
                clientX: undefined,
                clientY: undefined,
              })*!/
        this.clientXY.emit({
          clientX: undefined,
          clientY: undefined,
        })
        return
      }
      this.isDragging = false
      this.middleClickDown = false

      const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
      if (!location) return
      // console.log(location)
      const clientX = event.clientX
      const clientY = event.clientY
      this.pageXY.emit({
        x: event.pageX,
        y: event.pageY,
      })
      this.clientXY.emit({
        clientX,
        clientY,
      })
      await this.mouseService.mouse({ event, location })
      return
    }*/

  private setupClickListener() {
    this.ngZone.runOutsideAngular(() => {
      this.renderer.listen(this.elementRef.nativeElement, 'mousedown', (event: MouseEvent) => {
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
      })
      this.renderer.listen(this.elementRef.nativeElement, 'click', (event: MouseEvent) => {
        // console.log('CLICK')
        event.stopPropagation()
        event.preventDefault()
        this.handleClickEvent(event)
      })
      this.renderer.listen(this.elementRef.nativeElement, 'dblclick', (event: MouseEvent) => {
        // console.log('DOUBLE CLICK')
        event.stopPropagation()
        event.preventDefault()
        this.handleDoubleClickEvent(event)
      })

      /*     fromEvent<MouseEvent>(this.elementRef.nativeElement, 'click') /!*.pipe(

             // map((event: Event) => event as MouseEvent),
           )*!/
             .subscribe((event: MouseEvent) => {
               console.log('CLICK')
               this.handleClickEvent(event)
               event.stopPropagation()
               event.preventDefault()
             })*/
      /*      fromEvent(this.elementRef.nativeElement, 'dblclick').subscribe((event: MouseEvent) => {
              console.log('DOUBLE CLICK')
              this.handleDoubleClickEvent(event)
              event.stopPropagation()
              event.preventDefault()
            })*/
    })
  }

  private handleClickEvent(event: MouseEvent) {
    if (event.ctrlKey) return

    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
    if (location) {
      return this.clickService.click({ event: event as MouseEvent, location })
    }
    if (!location) {
      const secondDiv = (event.composedPath()[1] as HTMLDivElement).getAttribute('location')
      if (!secondDiv) return
      return this.clickService.click({ event: event as MouseEvent, location: secondDiv })
    }
    return
  }

  private handleDoubleClickEvent(event: MouseEvent) {
    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
    if (location) {
      return this.doubleClickService.doubleCLick({ event: event as MouseEvent, location })
    }
    if (!location) {
      const secondDiv = (event.composedPath()[1] as HTMLDivElement).getAttribute('location')
      if (!secondDiv) return
      return this.doubleClickService.doubleCLick({
        event: event as MouseEvent,
        location: secondDiv,
      })
    }
    return
  }

  /*@HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    if (event.ctrlKey) return
    // console.log(event)
    // const div = event.composedPath()[0] as HTMLDivElement
    // console.log(div)

    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
    if (location) {
      return this.clickService.click({ event: event as MouseEvent, location })
    }
    if (!location) {
      const secondDiv = (event.composedPath()[1] as HTMLDivElement).getAttribute('location')
      if (!secondDiv) return
      return this.clickService.click({ event: event as MouseEvent, location: secondDiv })
    }
    return
  }

  @HostListener('document:dblclick', ['$event'])
  handleDoubleClick(event: MouseEvent) {
    // console.log(event)
    // const divs = event.composedPath()
    // console.log(divs)
    // const div = event.composedPath()[0] as HTMLDivElement
    // console.log(div)
    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
    if (location) {
      return this.doubleClickService.doubleCLick({ event: event as MouseEvent, location })
    }
    if (!location) {
      const secondDiv = (event.composedPath()[1] as HTMLDivElement).getAttribute('location')
      if (!secondDiv) return
      return this.doubleClickService.doubleCLick({
        event: event as MouseEvent,
        location: secondDiv,
      })
    }
    return
  }*/

  /*
    private setupDragListener() {
      this.ngZone.runOutsideAngular(() => {
        /!*      this.renderer.listen(this.elementRef.nativeElement, 'mousedown', (event: MouseEvent) => {
                this.onMouseDownHandler(event)
                event.stopPropagation()
                event.preventDefault()
              })
              this.renderer.listen(this.elementRef.nativeElement, 'mouseup', (event: MouseEvent) => {
                this.onMouseUpHandler(event)
                event.stopPropagation()
                event.preventDefault()
              })
              this.renderer.listen(this.elementRef.nativeElement, 'mousemove', (event: MouseEvent) => {
                this.onMouseMoveHandler(event)
                event.stopPropagation()
                event.preventDefault()
              })*!/
      })
    }*/

  private onMouseMoveHandler(event: MouseEvent) {
    // event.preventDefault()
    // event.stopPropagation()
    // this.logDebug('onMouseMoveHandler')
    if (!this.startX || !this.startY || (!this.isDragging && !this.altKeyDragging)) {
      // this.logDebug('onMouseMoveHandler: return', this.startX, this.startY, this.isDragging)
      this.isDragging = false
      this.middleClickDown = false
      return
    }

    if (event.ctrlKey) {
      const parentRect = this.elementRef.nativeElement.parentNode.getBoundingClientRect()
      const mouseX =
        event.pageX -
        (parentRect.width - this.width) / 2 -
        this.elementRef.nativeElement.parentNode.offsetLeft

      const mouseY =
        event.pageY -
        (parentRect.height - this.height) / 2 -
        this.elementRef.nativeElement.parentNode.offsetTop

      const newStartY = this.startY
      const newStartX = this.startX

      const top = mouseY - newStartY
      const left = mouseX - newStartX

      if (
        top > (this.height * this.scale) / 2 ||
        top < this.negativeHeight / 2 - this.scale * 200 + this.height / 4.485
      ) {
        return
      }

      if (
        left > (this.width * this.scale) / 2 ||
        left < this.negativeWidth / 2 - this.scale * 200 + this.width / 5.925
      ) {
        return
      }

      this.elementRef.nativeElement.style.top = top + 'px'
      this.elementRef.nativeElement.style.left = left + 'px'
      this.elementRef.nativeElement.style.cursor = 'grab'
      return
    }

    if (event.altKey) {
      // this.logDebug('onMouseMoveHandler', 'altKey')
      // event.preventDefault()
      // event.stopPropagation()
      // this.logDebug('onDragging', event.clientX, event.clientY)
      if (!this.startX || !this.startY || !event.altKey) {
        // this.logDebug('onDragging', 'returning', this.startX, this.startY, event.altKey)
        return
      } else {
        this.pageX = event.pageX
        this.pageY = event.pageY
      }
      this.ngZone.runOutsideAngular(() => {
        this.animate()
      })
    }
  }

  animate() {
    if (!this.startX || !this.startY || !this.pageX || !this.pageY) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      return
    }
    const rect = this.canvas.getBoundingClientRect()

    const mouseX = this.pageX - rect.left
    const mouseY = this.pageY - rect.top

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const width = mouseX - this.startX
    const height = mouseY - this.startY

    this.ctx.globalAlpha = 0.4

    this.ctx.fillStyle = this.fillStyle
    // this.ctx.fillStyle = '#7585d8'
    this.ctx.fillRect(this.startX, this.startY, width, height)

    this.ctx.globalAlpha = 1.0

    requestAnimationFrame(() => this.animate())
  }

  /* @HostListener('document:mousemove', ['$event'])
   onDragging(event: MouseEvent) {
     event.preventDefault()
     event.stopPropagation()
     if (!this.startX || !this.startY || !this.isDragging) {
       this.isDragging = false
       this.middleClickDown = false
       return
     }

     /!*    if (!event.ctrlKey && event.button !== 1) {
           this.isDragging = false
           return
         }*!/

     if (event.ctrlKey /!* || this.middleClickDown*!/) {
       // console.log('MOUSEMOVE --WRAPPER', event)
       /!*      if (event.button === 1) {
               console.log('event.button ===1')
             }*!/
       const parentRect = this.elementRef.nativeElement.parentNode.getBoundingClientRect()
       const mouseX =
         event.pageX -
         (parentRect.width - this.width) / 2 -
         this.elementRef.nativeElement.parentNode.offsetLeft

       const mouseY =
         event.pageY -
         (parentRect.height - this.height) / 2 -
         this.elementRef.nativeElement.parentNode.offsetTop

       const newStartY = this.startY
       const newStartX = this.startX

       const top = mouseY - newStartY
       const left = mouseX - newStartX

       if (
         top > (this.height * this.scale) / 2 ||
         top < this.negativeHeight / 2 - this.scale * 200 + this.height / 4.485
       ) {
         return
       }

       if (
         left > (this.width * this.scale) / 2 ||
         left < this.negativeWidth / 2 - this.scale * 200 + this.width / 5.925
       ) {
         return
       }

       this.elementRef.nativeElement.style.top = top + 'px'
       this.elementRef.nativeElement.style.left = left + 'px'
       this.elementRef.nativeElement.style.cursor = 'grab'
       return
     }
   }*/

  /*
    @HostListener('window:keyup', ['$event'])
    async keyEvent(event: KeyboardEvent) {
      console.log(event)
      if (event.key === 'Control') {
        console.log(event)
        this.isDragging = false
        this.multiStore.dispatch.clearMultiState()
        this.elementRef.nativeElement.style.cursor = ''
      }

      if (event.key === 'r') {
        this.elementRef.nativeElement.style.top = '0px'
        this.elementRef.nativeElement.style.left = '0px'
      }
    }
  */

  ngOnInit(): void {
    this.height = Number(this.elementRef.nativeElement.style.height.split('p')[0])
    this.negativeHeight = Number(this.elementRef.nativeElement.style.height.split('p')[0]) * -1
    this.width = Number(this.elementRef.nativeElement.style.width.split('p')[0])
    this.negativeWidth = Number(this.elementRef.nativeElement.style.width.split('p')[0]) * -1
    this.setupClickListener()
    const parent = this.elementRef.nativeElement.parentNode
    this.logDebug('parent', parent)
    const parentElement = this.elementRef.nativeElement.parentElement
    this.logDebug('parentElement', parentElement)
    this.canvas = parentElement.querySelector('canvas')

    // const getCanvasElement = parentElement.querySelector('canvas')
    this.logDebug('getCanvasElement', this.canvas)
    // this.logDebug('getCanvasElement', this.canvas.nativeElement)
    const ctx = this.canvas.getContext('2d')
    this.logDebug('ctx', ctx)
    if (!ctx) {
      this.logError('ctx is null')
      throw ctx
    }
    this.ctx = ctx
    // = this.canvas.nativeElement.getContext('2d')
    // this.scale = Number(parent.style.transform.split('(')[1].split(')')[0])
    // this.setupDragListener()
  }
}
