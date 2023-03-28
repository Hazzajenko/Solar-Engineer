import { Directive, ElementRef, inject, NgZone, OnInit } from '@angular/core'

import { SoftColor } from '@shared/data-access/models'
import tippy from 'tippy.js'

@Directive({
  selector: '[appFreePanelDirective]',
  standalone: true,
})
export class FreePanelDirective implements OnInit {
  private elRef = inject(ElementRef)

  constructor(private readonly zone: NgZone) {
  }

  ngOnInit() {

    this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftBrown
    // this.elRef.nativeElement.style.backgroundColor = '#95c2fa'
    this.elRef.nativeElement.style.boxShadow = ``
    this.zone.runOutsideAngular(() => {
      this.setupTooltip()
    })
  }

  private setupTooltip() {
    tippy(this.elRef.nativeElement, {
      // content: 'Bazinga!',
    })
  }
}
