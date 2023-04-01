import { Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core'

@Directive({
  selector: '[appGridBackground]',
  standalone: true,
})
export class AppGridBackgroundDirective implements OnInit {
  private renderer = inject(Renderer2)
  private elementRef = inject(ElementRef<HTMLDivElement>)

  ngOnInit(): void {

    const offsetWidth = this.elementRef.nativeElement.offsetWidth
    const offsetHeight = this.elementRef.nativeElement.offsetHeight
    const left = (window.innerWidth - offsetWidth) / 2
    this.renderer.setStyle(this.elementRef.nativeElement, 'left', `${left}px`)
    const top = (window.innerHeight - offsetHeight) / 2
    this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${top}px`)
  }
}

