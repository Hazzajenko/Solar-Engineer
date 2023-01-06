import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject, Input, OnInit,
  Output, Renderer2,
} from '@angular/core'
import { MouseEventRequest } from '@grid-layout/data-access/utils'
import { ClientXY, ElementOffsets, GridLayoutXY, MouseXY } from '@grid-layout/shared/models'
import { UiRepository } from '@project-id/data-access/repositories'
import { PanelPathModel, SoftColor } from '@shared/data-access/models'
import { firstValueFrom, fromEvent, mergeMap, Observable, takeUntil, tap } from 'rxjs'
import { debounceTime, map } from 'rxjs/operators'
import { number } from 'ts-pattern/dist/patterns'

@Directive({
  selector: '[appWrapper]',
  standalone: true,
})
export class WrapperDirective implements OnInit {


  private elementRef = inject(ElementRef<HTMLDivElement>)
  private renderer = inject(Renderer2)
  private uiRepository = inject(UiRepository)
  private _zoomLevel = 1
  private _componentX?: number
  private _componentY?: number
  // private speed = 0.5
  public getScreenWidth: any
  public getScreenHeight: any
  private mouseClick!: { x: number, y: number, left: number, top: number }
  public mouse!: { x: number, y: number }
  private posX = 0
  private posY = 0

  private speed = 0.1
  private max_scale = 4
  private min_scale = 1
  private scale = 1


  top = 0
  left = 0
  isMoving = false // Flag to indicate
  // whether the component is being moved
  mouseX = 0 // X coordinate of the mouse
  mouseY = 0 // Y coordinate of the mouse
  componentX = 0 // X coordinate of the component
  componentY = 0 // Y coordinate of the component
  startX?: number
  startY?: number
  rect?: number

  isDragging = false

  offsetLeft = 0
  offsetTop = 0
  height!: number
  negativeHeight!: number

  width!: number
  negativeWidth!: number
  parentWidth!: number
  parentHeight!: number


  @Input() set setScale(scale: number) {
    if (scale < this.scale) {

      this.elementRef.nativeElement.style.top = '0px'
      this.elementRef.nativeElement.style.left = '0px'
    }
    this.scale = scale
  }

  @Input() set parentContainerSize(size: { height: number, width: number }) {
    this.parentWidth = size.width
    this.parentHeight = size.height
    // this.offsetLeft = (size.width - this.width) / 2
    // this.offsetTop = (size.height - this.height) / 2
    // console.log(this.offsetLeft)
  }

  @Input() set dragging(dragging: boolean) {
    console.log(dragging)
    this.isDragging = dragging
  }

  @Input() set mouseXY(mouseXY: MouseXY) {
    console.log(mouseXY)
    // this.startX = mouseXY.mouseX
    // this.startY = mouseXY.mouseY
  }


  // isZoomed = false

  /*
    mouseUpSub$ = fromEvent<MouseEvent>(document, 'mouseup').pipe(
      tap(() => {
        this.isDragging = false
        console.log('this.isDragging = false , ', this.isDragging)
      }),
    ).subscribe()

    mouseDownSub$ = fromEvent<MouseEvent>(document, 'mousedown').pipe(
      /!*    map(event => {
            if (this.isZoomed) {
              return event
            }
            return undefined
          }),*!/
      tap(event => {
        if (!event) return
        if (!event.ctrlKey) {
          this.isDragging = false
        }
        if (event.ctrlKey) {
          const rect = this.elementRef.nativeElement.getBoundingClientRect()
          this.startX = event.clientX - rect.left
          this.startY = event.clientY - rect.top
          this.isDragging = true
        }
      }),
    ).subscribe()*/

  /*  mouseMoveSub$ = fromEvent<MouseEvent>(document, 'mousemove').pipe(
      tap(event => {
        if (!event) return

        if (!event.ctrlKey || !this.startX || !this.startY || !this.isDragging) {
          return
        }
        if (event.ctrlKey && this.startX && this.startY && this.isDragging) {
          console.log(event.ctrlKey && this.startX && this.startY && this.isDragging)
          const mouseX = event.pageX - this.elementRef.nativeElement.parentNode.offsetLeft
          const mouseY = event.pageY - this.elementRef.nativeElement.parentNode.offsetTop

          const rect = this.elementRef.nativeElement.getBoundingClientRect()
          /!*        const newStartY = (this.startY - rect.top) / this.scale
                  const newStartX = (this.startX - rect.left) / this.scale*!/
          const newStartY = (this.startY) / this.scale
          const newStartX = (this.startX) / this.scale
          const top = mouseY - newStartY
          const left = mouseX - newStartX
          console.log(top)
          if (top > this.height - (200 / this.scale) || top < this.negativeHeight + (200 / this.scale < 1.5 ? (this.scale * 2) : (this.scale))) {
            return
          }
          if (left > this.width - (200 / this.scale) || left < this.negativeWidth + (200 / this.scale < 1.5 ? (this.scale * 2) : (this.scale))) {
            return
          }

          this.elementRef.nativeElement.style.top = top + 'px'
          this.elementRef.nativeElement.style.left = left + 'px'

          // this.elementRef.nativeElement.style.top = top + 'px'
          // this.elementRef.nativeElement.style.left = left + 'px'
          /!*        if (this.scale > 1) {
                    if (top > this.height - (200 / this.scale) || top < this.negativeHeight + (200 / this.scale)) {
                      this.elementRef.nativeElement.style.top = '0px'
                      this.elementRef.nativeElement.style.left = '0px'
                    } else {
                      this.elementRef.nativeElement.style.top = top + 'px'
                      this.elementRef.nativeElement.style.left = left + 'px'
                    }
                  }
                  if (top > this.height - (200) || top < this.negativeHeight + (200)) {
                    this.elementRef.nativeElement.style.top = '0px'
                    this.elementRef.nativeElement.style.left = '0px'
                  } else {
                    this.elementRef.nativeElement.style.top = top + 'px'
                    this.elementRef.nativeElement.style.left = left + 'px'
                  }*!/
          /!*
                  if (top > this.height - (200 / this.scale) || top < this.negativeHeight + (200 / this.scale)) {
                    console.log(this.height - (200 * this.scale))
                    console.log(this.negativeHeight + (200 * this.scale))
                    return
                  }
          *!/


          event.preventDefault()
          event.stopPropagation()
        }
      }),
    ).subscribe()*/

  /*
    @HostListener('document:mouseup', ['$event'])
    mouseUp(event: MouseEvent) {
      this.isDragging = false
      event.preventDefault()
      event.stopPropagation()
    }
  */

  @HostListener('document:mouseup', ['$event'])
  mouseUp(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isDragging = false
    /*    if (mouse.event.type === 'mouseup') {
          this.isGridMoving = false
          console.log('MOUSEUP-COMPONENT', mouse.event)
        }
       this.mouseService.mouse(mouse)*/
  }


  @HostListener('document:mousedown', ['$event'])
  mouseDown(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (!event.ctrlKey) {
      this.isDragging = false
      return
    }
    if (event.ctrlKey) {
      console.log('MOUSEDOWN--WRAPPER', event)
      /*     const path = event.composedPath()
           // event.composedPath().indexOf(1)
           console.log(event.target)
           if ((event.target as any).classList.contains('via-row')) {
             console.log('Event came through div1')
           }
           // ('via-div1')
           console.log('PATH', path)
           console.log('PANEL', path[0])
           path.forEach(p => {
             console.log(p)
           })*/
      // const pathArr = []
      /*      const node = event.target
            while (node !== document.body && node !== null) {
              pathArr.push(node)
              // node = node.parentNode;
            }*/
      // console.log(pathArr)
      /*  const offsetLeft = this.mouseClick.x - this.boxPosition.left;
        const offsetRight = this.width - offsetLeft;
        const offsetTop = this.mouseClick.y - this.boxPosition.top;
        const offsetBottom = this.height - offsetTop;*/
      const rect = this.elementRef.nativeElement.getBoundingClientRect()
      // this.mouseClick = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top }
      console.log(rect)
      this.startX = event.clientX - rect.left
      this.startY = event.clientY - rect.top


      this.isDragging = true
    }

  }

  /*
  *
  * 449.7465362548828 891.5347290039062
  *
  * 386.1267395019531 776.467041015625
  *
  * 375.52952575683594 572.2031555175781
  *
  * */


  @HostListener('document:mousemove', ['$event'])
  onDragging(event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    if (!event.ctrlKey || !this.startX || !this.startY || !this.isDragging) {
      this.isDragging = false
      return
    }
    if (event.ctrlKey && this.startX && this.startY && this.isDragging) {
      // this.mouse = { x: event.clientX, y: event.clientY }
      console.log('MOUSEMOVE--WRAPPER', event, this.scale)
      // console.log(event.ctrlKey && this.startX && this.startY && this.isDragging)
      // offsetX = e.target.offsetLeft + e.offsetX;
      // offsetY = e.target.offsetTop + e.offsetY;
      /*      width: 1185px;
            top: 0px;
            left: 256px;*/
      console.log('startY', this.startY)
      console.log('startX', this.startX)

      const parentRect = this.elementRef.nativeElement.parentNode.getBoundingClientRect()
      // const mouseX = event.pageX - (Number(this.elementRef.nativeElement.parentNode.width) - this.width) / 2 - this.elementRef.nativeElement.parentNode.offsetLeft
      const mouseX = event.pageX - (parentRect.width - this.width) / 2 - this.elementRef.nativeElement.parentNode.offsetLeft
      console.log(mouseX)
      console.log(this.elementRef.nativeElement.parentNode)
      // const mouseX = event.pageX - 350
      // const mouseX = event.pageX - this.elementRef.nativeElement.parentNode.offsetLeft
      const mouseY = event.pageY - (parentRect.height - this.height) / 2 - this.elementRef.nativeElement.parentNode.offsetTop
      console.log(mouseY)
      // const mouseY = event.pageY - this.elementRef.nativeElement.parentNode.offsetTop

      console.log(this.elementRef.nativeElement.parentNode.getBoundingClientRect())
      // parentNode.getBoundingClientRect();
      console.log(event.pageX)
      console.log(event.pageY)
      console.log(this.elementRef.nativeElement.parentNode)
      console.log(this.elementRef.nativeElement.parentNode.offsetLeft)
      console.log(this.elementRef.nativeElement.parentNode.offsetTop)
      /*      console.log('mouseY', mouseY)
            console.log('mouseY', mouseY)*/
      console.log('mouseX', mouseX, 'event.pageX - this.elementRef.nativeElement.parentNode.offsetLeft', `${event.pageX}-${this.elementRef.nativeElement.parentNode.offsetLeft}`)
      console.log('mouseY', mouseY, 'event.pageY - this.elementRef.nativeElement.parentNode.offsetTop', `${event.pageY}-${this.elementRef.nativeElement.parentNode.offsetTop}`)
      // const rect = this.elementRef.nativeElement.getBoundingClientRect()


      /*        const newStartY = (this.startY - rect.top) / this.scale
              const newStartX = (this.startX - rect.left) / this.scale*/
      /*      const newStartY = (this.startY) / this.scale
            const newStartX = (this.startX) / this.scale
            const top = mouseY - newStartY
            const left = mouseX - newStartX*/
      /*      const newStartY = this.startY / this.scale
            const newStartX = this.startX / this.scale*/

      const newStartY = this.startY
      const newStartX = this.startX
      console.log('newStartY', newStartY, 'this.startY / this.scale', `${this.startY}/${this.scale}`)
      console.log('newStartX', newStartX, 'this.startX / this.scale', `${this.startX}/${this.scale}`)
      const top = mouseY - newStartY
      const left = mouseX - newStartX
      /*      console.log('top', mouseY, '-', newStartY)
            console.log('left', mouseX, '-', newStartX)*/
      console.log('top', top, 'mouseY - newStartY', `${mouseY}/${newStartY}`)
      console.log('left', left, 'mouseX - newStartX', `${mouseX}/${newStartX}`)
      /*      if (top > (this.scale > 1.5 ? this.height : this.height - 200) || top < (this.scale > 1.5 ? this.negativeHeight : this.negativeHeight + 200)) {
              return
            }
            if (left > 255 || left < -255) {
              return
            }*/
      /*            if (left > (this.scale > 1.5 ? this.width - 600 : this.width - 200) || left < (this.scale > 1.5 ? this.negativeWidth + 900 : this.negativeWidth + 200)) {
                    return
                  }*/
      //half of width
      /*      if (top > ((this.height * this.scale) - (this.height * 20 / 100)) || top < (this.negativeHeight) * 80 / 100) {
              return
            }*/
      console.log(this.height)
      console.log(this.height / 4.485)
      console.log(this.negativeHeight / (this.scale * 2))
      // (this.height / 4.485) === 200
      if (top > ((this.height * this.scale) / 2) || top < ((this.negativeHeight / 2) - (this.scale * 200) + (this.height / 4.485))) {
        // if (top > ((this.height * this.scale) / 2) || top < ((this.negativeHeight / 2) - (this.scale * 200) + 200)) {
        // if (top > ((this.height * this.scale) / 2) || top < ((this.negativeHeight / 2) - (this.scale * 50))) {
        return
      }

      console.log(this.width)
      console.log(this.width / 5.925)

      console.log((this.width / 4.485) - 50 - 15)
      console.log((this.width / 5.925))

      // (this.width / 5.925) === 200
      if (left > ((this.width * this.scale) / 2) || left < (this.negativeWidth / 2) - (this.scale * 200) + (this.width / 5.925)) {
        // if (left > ((this.width * this.scale) / 2) || left < (this.negativeWidth / 2)) {
        return
      }
      console.log((this.scale < 1.5 ? (this.width - 300) : this.width) - (200 / this.scale))

      // this.scale > 1.5 ? this.height : this.height-100
      // this.height - (200 / this.scale)
      /*
      (this.negativeHeight + 200) + (200 / this.scale * this.scale)
      (this.negativeHeight
      left > this.width - (200 / this.scale) || left < (this.negativeWidth + 200) + (200 / this.scale * this.scale)
      this.scale > 1.5 ? this.negativeHeight : this.negativeHeight+100
      this.height - (200 / this.scale)
      * when not zoomed in its 100 less than height
      * when its zoomed in it should be the height
      *
      * */
      // this.scale < 1.5 ? (this.scale) : (this.scale * 2)

      // this.scale < 1.5 ? (this.scale) : (this.scale * 2)
      // this.scale < 1.5 ? (this.width+100) : this.width
      // this.width
      /*      console.log('left', left, '-', newStartX)
            console.log('top', top)
            console.log('left', left)*/
      /*      if (top > this.height - (200 / this.scale) || top < this.negativeHeight + (200 / this.scale < 1.5 ? (this.scale * 2) : (this.scale))) {
              return
            }
            if (left > this.width - (200 / this.scale) || left < this.negativeWidth + (200 / this.scale < 1.5 ? (this.scale * 2) : (this.scale))) {
              return
            }*/
      // console.log(top)
      /*      if (top > this.height - (200 / this.scale) || top < this.negativeHeight + (200 / this.scale < 1.5 ? (this.scale * 2) : (this.scale))) {
              return
            }
            if (left > this.width - (200 / this.scale) || left < this.negativeWidth + (200 / this.scale < 1.5 ? (this.scale * 2) : (this.scale))) {
              return
            }*/
      /*
            this.left = this.mouseClick.left + (this.mouse.x - this.mouseClk.x)/*
            this.top = this.mouseClick.top + (this.mouse.y - this.mouseClick.y)*/

      this.elementRef.nativeElement.style.top = top + 'px'
      this.elementRef.nativeElement.style.left = left + 'px'


    }
  }

  /*  @Input() setIsGridMoving(moving: boolean) {
      this.isDragging = moving
    }*/

  ngOnInit(): void {
    this.height = Number(this.elementRef.nativeElement.style.height.split('p')[0])
    this.negativeHeight = Number(this.elementRef.nativeElement.style.height.split('p')[0]) * -1.
    this.width = Number(this.elementRef.nativeElement.style.width.split('p')[0])
    this.negativeWidth = Number(this.elementRef.nativeElement.style.width.split('p')[0]) * -1.
    const { top, left } = this.elementRef.nativeElement.getBoundingClientRect()
    this.top = top
    this.left = left

    console.log(this.height, this.width, top, left)
  }

}
