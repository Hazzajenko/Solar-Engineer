import { addWarning } from '@angular-devkit/build-angular/src/utils/webpack-diagnostics'
import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core'
import { ClickService, DoubleClickService, MouseService } from '@grid-layout/data-access/services'

import { ClientXY, XYModel } from '@grid-layout/shared/models'
import { MultiStoreService } from '@project-id/data-access/facades'


@Directive({
  selector: '[appWrapper]',
  standalone: true,
})
export class WrapperDirective implements OnInit {
  private multiStore = inject(MultiStoreService)

  private elementRef = inject(ElementRef<HTMLDivElement>)
  private renderer = inject(Renderer2)
  // private uiRepository = inject(UiRepository)
  private mouseService = inject(MouseService)
  private clickService = inject(ClickService)
  private doubleClickService = inject(DoubleClickService)

  scale = 1
  startX?: number
  startY?: number
  isDragging = false

  height!: number
  negativeHeight!: number

  width!: number
  negativeWidth!: number
  middleClickDown = false


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
        console.log('CONTROL')
        this.isDragging = false
        this.multiStore.dispatch.clearMultiState()
        this.elementRef.nativeElement.style.cursor = ''
        break
      }
    }
    this.resetKeyUp.emit('')
  }

  @HostListener('document:mouseup', ['$event'])
  async mouseUp(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    console.log('MOUSEUP--WRAPPER', event)
    if (this.isDragging || event.ctrlKey) {
      this.isDragging = false
      this.elementRef.nativeElement.style.cursor = ''
      return
    }
    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
    console.log(location)
    if (!location) return
    return this.mouseService.mouse({ event, location })
  }


  @HostListener('document:mousedown', ['$event'])
  async mouseDown(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    console.log('MOUSEDOWN--WRAPPER', event)
    if (event.ctrlKey/* || event.button === 1*/) {
      console.log('MOUSEDOWN--WRAPPER', event)
      const rect = this.elementRef.nativeElement.getBoundingClientRect()
      this.startX = event.clientX - rect.left
      this.startY = event.clientY - rect.top
      this.isDragging = true
      /*      if (event.button === 1) {
              this.middleClickDown = true
            }*/
      return
    }
    if (!event.altKey) {
      /*      this.uiRepository.setClientXY({
              clientX: undefined,
              clientY: undefined,
            })*/
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
    console.log(location)
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


  }

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    if (event.ctrlKey) return
    console.log(event)
    const div = (event.composedPath()[0] as HTMLDivElement)
    console.log(div)

    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
    if (location) {
      return this.clickService.click({ event: (event as MouseEvent), location })
    }
    if (!location) {
      const secondDiv = (event.composedPath()[1] as HTMLDivElement).getAttribute('location')
      if (!secondDiv) return
      return this.clickService.click({ event: (event as MouseEvent), location: secondDiv })
    }
    return
  }


  @HostListener('document:dblclick', ['$event'])
  handleDoubleClick(event: MouseEvent) {
    console.log(event)
    const divs = (event.composedPath())
    console.log(divs)
    const div = (event.composedPath()[0] as HTMLDivElement)
    console.log(div)
    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
    if (location) {
      return this.doubleClickService.doubleCLick({ event: (event as MouseEvent), location })
    }
    if (!location) {
      const secondDiv = (event.composedPath()[1] as HTMLDivElement).getAttribute('location')
      if (!secondDiv) return
      return this.doubleClickService.doubleCLick({ event: (event as MouseEvent), location: secondDiv })
    }
    return
  }

  @HostListener('document:mousemove', ['$event'])
  onDragging(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (!this.startX || !this.startY || !this.isDragging) {
      this.isDragging = false
      this.middleClickDown = false
      return
    }

    /*    if (!event.ctrlKey && event.button !== 1) {
          this.isDragging = false
          return
        }*/

    if (event.ctrlKey/* || this.middleClickDown*/) {
      console.log('MOUSEMOVE --WRAPPER', event)
      /*      if (event.button === 1) {
              console.log('event.button ===1')
            }*/
      const parentRect = this.elementRef.nativeElement.parentNode.getBoundingClientRect()
      const mouseX = event.pageX - (parentRect.width - this.width) / 2 - this.elementRef.nativeElement.parentNode.offsetLeft

      const mouseY = event.pageY - (parentRect.height - this.height) / 2 - this.elementRef.nativeElement.parentNode.offsetTop


      const newStartY = this.startY
      const newStartX = this.startX

      const top = mouseY - newStartY
      const left = mouseX - newStartX

      if (top > ((this.height * this.scale) / 2) || top < ((this.negativeHeight / 2) - (this.scale * 200) + (this.height / 4.485))) {
        return
      }


      if (left > ((this.width * this.scale) / 2) || left < (this.negativeWidth / 2) - (this.scale * 200) + (this.width / 5.925)) {
        return
      }

      this.elementRef.nativeElement.style.top = top + 'px'
      this.elementRef.nativeElement.style.left = left + 'px'
      this.elementRef.nativeElement.style.cursor = 'grab'
      return
    }


  }

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
    this.negativeHeight = Number(this.elementRef.nativeElement.style.height.split('p')[0]) * -1.
    this.width = Number(this.elementRef.nativeElement.style.width.split('p')[0])
    this.negativeWidth = Number(this.elementRef.nativeElement.style.width.split('p')[0]) * -1.
  }
}
