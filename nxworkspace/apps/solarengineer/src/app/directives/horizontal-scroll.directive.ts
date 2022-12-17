import { Directive, ElementRef, HostListener, ViewContainerRef } from '@angular/core'

@Directive({
  selector: '[horizontal]',
  standalone: true,
})
export class HorizontalScrollDirective {
  constructor(private elRef: ElementRef, private view: ViewContainerRef) {}

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    /*    console.log(
          'this.elRef.nativeElement.scrollLeft',
          this.elRef.nativeElement.scrollLeft,

        )
        console.log('view', this.view)*/
    event.preventDefault()
    // this.elRef.nativeElement.scrollLeft = 100
    /*    this.view.element.nativeElement.scrollLeft =
          this.view.element.nativeElement.scrollLeft + 1

        this.view.element.nativeElement.style.transform = 'scale(2)'

        console.log(this.view.element.nativeElement.scrollLeft)
        console.log(this.view.element)*/

    // console.log(event.deltaY)
    /*    if (event.altKey) {
          return (this.elRef.nativeElement.scrollLeft = -100)
          // return (this.elRef.nativeElement.scrollLeft += event.deltaY!)
        }
        return*/
  }

  /*if (event.ctrlKey) {
    if (event.deltaY < 0) {
      if (this.elRef.nativeElement.style.transform == '') {
        return (this.elRef.nativeElement.scrollLeft += event.deltaY)
        // return (this.elRef.nativeElement.style.transform = 'scale(1.25)')

        // return (this.elRef.nativeElement.style.zoom = 1.25)
      } /!*else if (this.elRef.nativeElement.style.transform == 'scale(1.25)') {
        return (this.elRef.nativeElement.style.transform = 'scale(1.5)')

        // return (this.elRef.nativeElement.style.zoom = 1.25)
      } else if (this.elRef.nativeElement.style.transform == 'scale(1.5)') {
        return (this.elRef.nativeElement.style.transform = 'scale(1.75)')
        // return (this.elRef.nativeElement.style.zoom = 1.5)
      } else if (this.elRef.nativeElement.style.transform == 'scale(1.75)') {
        return (this.elRef.nativeElement.style.transform = 'scale(2)')
        // return (this.elRef.nativeElement.style.zoom = 1.75)
      } else if (this.elRef.nativeElement.style.transform == 'scale(2)') {
        return (this.elRef.nativeElement.style.transform = 'scale(2.25)')
        // return (this.elRef.nativeElement.style.zoom = 2)
      } else if (this.elRef.nativeElement.style.transform == 'scale(2.25)') {
        return (this.elRef.nativeElement.style.transform = 'scale(2.50)')
        // return (this.elRef.nativeElement.style.zoom = 2.25)
      } else if (this.elRef.nativeElement.style.transform == 'scale(2.50)') {
        return (this.elRef.nativeElement.style.transform = 'scale(2.75)')
        // return (this.elRef.nativeElement.style.zoom = 2.5)
      } else if (this.elRef.nativeElement.style.transform == 'scale(2.75)') {
        return (this.elRef.nativeElement.style.transform = 'scale(3)')
        // return (this.elRef.nativeElement.style.zoom = 2.75)
      }*!/

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
}*/
}
