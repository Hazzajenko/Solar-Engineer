import { Directive, ElementRef, Host, HostListener } from '@angular/core'
import { on } from '@ngrx/store'

@Directive({
  selector: '[zoom]',
  standalone: true
})
export class ZoomDirective {
  constructor(private elRef: ElementRef) {

/*    @HostListener('wheel') wheel() {
      this.elRef.nativeElement.style.color = 'blue'
    }*/

 /* @HostListener('wheel', ['$event'])
    onWheel(event: WheelEvent) {
      if (!event.ctrlKey) return
      event.preventDefault()
      console.log(event.deltaY)
      if (event.ctrlKey) {
        if (event.deltaY < 0) {
          // this.zoom = this.zoom + 1
          // this.zoom = event.deltaY
          if (this.zoom < 100) {
            this.zoom = this.zoom + 0.1
            console.log('ZOOM', this.zoom)
            console.log('up')
            this.zoom = Math.round((this.zoom + Number.EPSILON) * 100) / 100
          }
        }
        if (event.deltaY > 0) {
          if (this.zoom > 1) {
            this.zoom = this.zoom - 0.1
            console.log('ZOOM', this.zoom)
            console.log('down')
            this.zoom = Math.round((this.zoom + Number.EPSILON) * 100) / 100
          }
        }
      }

      console.log('WHEEL', event)
      /!*    let scale = this.scale - $event.deltaY * this.scaleFactor;
          scale = clamp(scale, 1, this.zoomThreshold);
          this.calculatePinch(scale);*!/
    }
  }*/
}
