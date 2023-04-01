import { Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core'

@Directive({
  selector: '[appGridBackground]',
  standalone: true,
})
export class AppGridBackgroundDirective implements OnInit {
  private renderer = inject(Renderer2)
  private elementRef = inject(ElementRef<HTMLDivElement>)

  ngOnInit(): void {
    /*    const offsetLeft = this.elementRef.nativeElement.offsetLeft
     const offsetTop = this.elementRef.nativeElement.offsetTop
     const offsetWidth = this.elementRef.nativeElement.offsetWidth
     const offsetHeight = this.elementRef.nativeElement.offsetHeight*/
    /*    console.log(offsetLeft, offsetTop, offsetWidth, offsetHeight)
     /!*    const left = offsetWidth - this.elementRef.nativeElement.parentElement.style.width
     console.log(left)*!/
     const parentElement = this.elementRef.nativeElement.parentElement
     console.log(parentElement)
     const nextParentElement = parentElement
     console.log(nextParentElement)
     const nextParentWidth = nextParentElement.style.width
     console.log(nextParentWidth)
     const widthWithoutPx = nextParentWidth.replace('px', '')
     console.log(widthWithoutPx)
     const widthToNumber = Number(widthWithoutPx)
     console.log(widthToNumber)
     const left = offsetWidth - widthToNumber
     console.log(left)
     const leftV2 = window.screenLeft / 2
     console.log(leftV2)*/
    const offsetWidth = this.elementRef.nativeElement.offsetWidth
    const offsetHeight = this.elementRef.nativeElement.offsetHeight
    const left = (window.innerWidth - offsetWidth) / 2
    this.renderer.setStyle(this.elementRef.nativeElement, 'left', `${left}px`)
    const top = (window.innerHeight - offsetHeight) / 2
    this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${top}px`)

    // this.setupMouseEventListeners()
  }

}

