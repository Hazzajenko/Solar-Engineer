import { Directive, ElementRef, Input } from '@angular/core'
import { PanelModel } from '../projects/models/panel.model'

@Directive({
  selector: '[panelDirective]',
  standalone: true,
})
export class PanelDirective {
  @Input() data?: {
    panel?: PanelModel
    panelsToJoin?: PanelModel[]
  }

  constructor(private elRef: ElementRef) {
    if (this.data) {
      if (this.data.panel) {
        if (this.data.panelsToJoin) {
          if (this.data.panelsToJoin.includes(this.data.panel)) {
            this.elRef.nativeElement.style.backgroundColor = '#07ffd4'
          }
        }
      }
    }
  }
}
