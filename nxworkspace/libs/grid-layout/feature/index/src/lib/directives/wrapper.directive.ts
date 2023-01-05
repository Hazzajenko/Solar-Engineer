import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject, Input, OnInit,
  Output, Renderer2,
} from '@angular/core'
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
  private posX = 0
  private posY = 0

  private speed = 0.1
  private max_scale = 4
  private min_scale = 1
  @Input() scale = 1
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

  @Input() set dragging(dragging: boolean) {
    console.log(dragging)
    this.isDragging = dragging
  }

  @Input() set mouseXY(mouseXY: MouseXY) {
    console.log(mouseXY)
    this.startX = mouseXY.mouseX
    this.startY = mouseXY.mouseY
  }


  isZoomed = false
  height!: number
  negativeHeight!: number

  width!: number
  negativeWidth!: number


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
    ).subscribe()
  */

  mouseMoveSub$ = fromEvent<MouseEvent>(document, 'mousemove').pipe(
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
        /*        const newStartY = (this.startY - rect.top) / this.scale
                const newStartX = (this.startX - rect.left) / this.scale*/
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
        /*        if (this.scale > 1) {
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
                }*/
        /*
                if (top > this.height - (200 / this.scale) || top < this.negativeHeight + (200 / this.scale)) {
                  console.log(this.height - (200 * this.scale))
                  console.log(this.negativeHeight + (200 * this.scale))
                  return
                }
        */


        event.preventDefault()
        event.stopPropagation()
      }
    }),
  ).subscribe()


  /*  @Input() setIsGridMoving(moving: boolean) {
      this.isDragging = moving
    }*/

  ngOnInit(): void {
    this.height = this.elementRef.nativeElement.style.height.split('p')[0]
    this.negativeHeight = Number(this.elementRef.nativeElement.style.height.split('p')[0]) * -1.
    this.width = this.elementRef.nativeElement.style.width.split('p')[0]
    this.negativeWidth = Number(this.elementRef.nativeElement.style.width.split('p')[0]) * -1.
    const { top, left } = this.elementRef.nativeElement.getBoundingClientRect()
    this.top = top
    this.left = left
  }

}
