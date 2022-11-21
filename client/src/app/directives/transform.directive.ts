import { Directive, ElementRef, HostListener } from '@angular/core'

@Directive({
  selector: '[transform]',
  standalone: true,
})
export class TransformDirective {
  constructor(private elRef: ElementRef) {}

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    console.log(
      'this.elRef.nativeElement.style',
      this.elRef.nativeElement.style,
    )
    event.preventDefault()
    console.log(event.deltaY)
    if (event.ctrlKey) {
      if (event.deltaY < 0) {
        if (this.elRef.nativeElement.style.transform == '') {
          return (this.elRef.nativeElement.style.transform = 'scale(1.25)')

          // return (this.elRef.nativeElement.style.zoom = 1.25)
        } else if (this.elRef.nativeElement.style.transform == 'scale(1.25)') {
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
