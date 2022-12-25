import { Directive, ElementRef, inject, Input } from '@angular/core'

@Directive({
  selector: '[appPanelDirective]',
  standalone: true,
})
export class PanelDirective {
  private elRef = inject(ElementRef)
  @Input() set id(id: string) {
    this.elRef.nativeElement.style.backgroundColor = '#07ffd4'
  }
}
