import { Directive, ElementRef, HostListener } from '@angular/core'

@Directive({
  selector: '[zoom]',
  standalone: true,
})
export class ZoomDirective {
  constructor(private elRef: ElementRef) {}

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    console.log('ZoomDirective', event)
    console.log(' this.elRef.nativeElement', this.elRef.nativeElement)
    console.log('this.elRef.nativeElement.style.zoom', this.elRef.nativeElement.style)
    console.log('this.elRef.nativeElement.step', this.elRef.nativeElement.step)
    // console.log('ZoomDirective')
    let zoom = this.elRef.nativeElement.style.zoom
    /*      -moz-transform: scale(1.1);
        -webkit-transform: scale(1.1);
        transform: scale(1.1);*/
    if (!event.ctrlKey) return
    event.preventDefault()
    console.log(event.deltaY)
    if (event.ctrlKey) {
      if (zoom === '') this.elRef.nativeElement.style.zoom = 1

      if (event.deltaY < 0) {
        /*        return (this.elRef.nativeElement.style.zoom =
                  this.elRef.nativeElement.style.zoom + 0.1)*/
        if (this.elRef.nativeElement.style.zoom < 1.25) {
          // this.elRef.nativeElement.style.transform = 'scale(1.25)'
          // this.elRef.nativeElement.style.webkitTransform = 1.25
          // this.elRef.nativeElement.transform = 1.25
          // this.elRef.nativeElement.style.webkitTransform = 1.25

          return (this.elRef.nativeElement.style.zoom = 1.25)
        } else if (this.elRef.nativeElement.style.zoom < 1.5) {
          // this.elRef.nativeElement.style.transform = 'scale(1.5)'
          return (this.elRef.nativeElement.style.zoom = 1.5)
        } else if (this.elRef.nativeElement.style.zoom < 1.75) {
          // this.elRef.nativeElement.style.transform = 'scale(1.75)'
          return (this.elRef.nativeElement.style.zoom = 1.75)
        } else if (this.elRef.nativeElement.style.zoom < 2) {
          // this.elRef.nativeElement.style.transform = 'scale(2)'
          return (this.elRef.nativeElement.style.zoom = 2)
        } else if (this.elRef.nativeElement.style.zoom < 2.25) {
          // this.elRef.nativeElement.style.transform = 'scale(2.25)'
          return (this.elRef.nativeElement.style.zoom = 2.25)
        } else if (this.elRef.nativeElement.style.zoom < 2.5) {
          // this.elRef.nativeElement.style.transform = 'scale(2.5)'
          return (this.elRef.nativeElement.style.zoom = 2.5)
        } else if (this.elRef.nativeElement.style.zoom < 2.75) {
          // this.elRef.nativeElement.style.transform = 'scale(2.75)'
          return (this.elRef.nativeElement.style.zoom = 2.75)
        }

        return console.log('MAX ZOOM')
      }
      if (event.deltaY > 0) {
        if (this.elRef.nativeElement.style.zoom > 2.75) {
          return (this.elRef.nativeElement.style.zoom = 2.75)
        } else if (this.elRef.nativeElement.style.zoom > 2.5) {
          return (this.elRef.nativeElement.style.zoom = 2.5)
        } else if (this.elRef.nativeElement.style.zoom > 2.25) {
          return (this.elRef.nativeElement.style.zoom = 2.25)
        } else if (this.elRef.nativeElement.style.zoom > 2) {
          return (this.elRef.nativeElement.style.zoom = 2)
        } else if (this.elRef.nativeElement.style.zoom > 1.75) {
          return (this.elRef.nativeElement.style.zoom = 1.75)
        } else if (this.elRef.nativeElement.style.zoom > 1.5) {
          return (this.elRef.nativeElement.style.zoom = 1.5)
        } else if (this.elRef.nativeElement.style.zoom > 1.25) {
          return (this.elRef.nativeElement.style.zoom = 1.25)
        } else if (this.elRef.nativeElement.style.zoom > 1) {
          return (this.elRef.nativeElement.style.zoom = 1)
        } else if (this.elRef.nativeElement.style.zoom > 0.75) {
          return (this.elRef.nativeElement.style.zoom = 0.75)
        }

        return console.log('MAX ZOOM')
      }
    }
  }
}
