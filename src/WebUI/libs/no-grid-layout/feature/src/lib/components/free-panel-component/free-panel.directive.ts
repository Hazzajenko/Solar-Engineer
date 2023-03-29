import { Directive, ElementRef, inject, Input, NgZone, OnInit } from '@angular/core'

import { SoftColor } from '@shared/data-access/models'
import tippy from 'tippy.js'
import { NoGridLayoutService } from '../../no-grid-layout.service'

@Directive({
  selector: '[appFreePanelDirective]',
  standalone: true,
})
export class FreePanelDirective implements OnInit {
  elRef = inject(ElementRef)
  private noGridLayoutService = inject(NoGridLayoutService)
  private _panelId = ''
  cachedClass = ''

  // classForPanel

  constructor(private readonly zone: NgZone) {
  }

  @Input() set panelId(panelId: string) {
    // this.noGridLayoutService.panelsHaveClass = panelId
    this.noGridLayoutService.getClassesForPanel$(panelId).subscribe((classes) => {
        // console.log('classes', classes)
        if (classes) {
          this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftGreen
          // this.elRef.nativeElement.classList.add(classes)
        } else {
          this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftBrown
          // this.elRef.nativeElement.classList.remove(classes)
        }
        // this.elRef.nativeElement.classList.add(...classes)
        // c

      },
    )
  }

  get panelId() {
    return this._panelId
  }

  ngOnInit() {

    // this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftBrown
    // this.elRef.nativeElement.style.backgroundColor = '#95c2fa'
    // this.elRef.nativeElement.style.boxShadow = ``
    this.zone.runOutsideAngular(() => {
      this.setupTooltip()
    })
    // this.noGridLayoutService.panelsHaveClass
  }

  setStyle() {
    this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftGreen
    this.elRef.nativeElement.style.boxShadow = `0 0 0 2px ${SoftColor.SoftGreen}`
  }

  private setupTooltip() {
    tippy(this.elRef.nativeElement, {
      // content: 'Bazinga!',
    })
  }
}
