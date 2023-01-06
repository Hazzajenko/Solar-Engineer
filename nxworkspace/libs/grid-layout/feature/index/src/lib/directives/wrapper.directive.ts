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
import { MouseService } from '@grid-layout/data-access/services'

import { ClientXY } from '@grid-layout/shared/models'


@Directive({
  selector: '[appWrapper]',
  standalone: true,
})
export class WrapperDirective implements OnInit {


  private elementRef = inject(ElementRef<HTMLDivElement>)
  private renderer = inject(Renderer2)
  // private uiRepository = inject(UiRepository)
  private mouseService = inject(MouseService)

  scale = 1
  startX?: number
  startY?: number
  isDragging = false

  height!: number
  negativeHeight!: number

  width!: number
  negativeWidth!: number


  @Output() clientXY: EventEmitter<ClientXY> = new EventEmitter<ClientXY>()

  @Input() set setScale(scale: number) {
    if (scale < this.scale) {
      this.elementRef.nativeElement.style.top = '0px'
      this.elementRef.nativeElement.style.left = '0px'
    }
    this.scale = scale
  }

  @HostListener('document:mouseup', ['$event'])
  async mouseUp(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isDragging = false
    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
    if (!location) return
    return this.mouseService.mouse({ event, location })
  }


  @HostListener('document:mousedown', ['$event'])
  async mouseDown(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (event.ctrlKey) {
      console.log('MOUSEDOWN--WRAPPER', event)
      const rect = this.elementRef.nativeElement.getBoundingClientRect()
      this.startX = event.clientX - rect.left
      this.startY = event.clientY - rect.top
      this.isDragging = true
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

    const location = (event.composedPath()[0] as HTMLDivElement).getAttribute('location')
    if (!location) return
    console.log(location)
    const clientX = event.clientX
    const clientY = event.clientY
    this.clientXY.emit({
      clientX,
      clientY,
    })
    await this.mouseService.mouse({ event, location })
    return


  }

  @HostListener('document:mousemove', ['$event'])
  onDragging(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (!event.ctrlKey || !this.startX || !this.startY || !this.isDragging) {
      this.isDragging = false
      return
    }

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
    return
  }


  ngOnInit(): void {
    this.height = Number(this.elementRef.nativeElement.style.height.split('p')[0])
    this.negativeHeight = Number(this.elementRef.nativeElement.style.height.split('p')[0]) * -1.
    this.width = Number(this.elementRef.nativeElement.style.width.split('p')[0])
    this.negativeWidth = Number(this.elementRef.nativeElement.style.width.split('p')[0]) * -1.
  }
}
