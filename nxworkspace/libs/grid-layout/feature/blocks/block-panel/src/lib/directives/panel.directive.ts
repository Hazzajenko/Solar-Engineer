import { Directive, ElementRef, inject, Input } from '@angular/core'
import { PanelNgModel } from '../models/panel-ng.model'

@Directive({
  selector: '[appPanelDirective]',
  standalone: true,
})
export class PanelDirective {
  private elRef = inject(ElementRef)
  @Input() set id(id: string) {
    this.elRef.nativeElement.style.backgroundColor = '#95c2fa'
  }

  @Input() set panelNg(panelNg: PanelNgModel) {
    if (panelNg.isSelectedPanel) {
      this.elRef.nativeElement.style.backgroundColor = '#07ffd4'
      // this.elRef.nativeElement.style.backgroundColor = 'bg-blue-300'
      // return 'bg-blue-300'
    } else {
      this.elRef.nativeElement.style.backgroundColor = '#95c2fa'
    }
  }
}
