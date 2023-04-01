import { Directive, ElementRef, inject, Input, NgZone, OnInit, Renderer2 } from '@angular/core'

import { SoftColor } from '@shared/data-access/models'
import tippy from 'tippy.js'
import { NoGridLayoutService } from '../../no-grid-layout.service'
import { BackgroundColor, BgColorBuilder } from '../../bg-color.builder'
import { FreePanelUtil, PanelRotationConfig } from '../../configs/free-panel.util'

// import { BackgroundColor } from '@no-grid-layout/feature'

/*export const cleanVar = <T extends string | undefined>(v: T) =>
 v?.replace(searchValue, replaceValue) as T extends string ? string : undefined*/

/*declare const cleanVar: <T extends string | undefined>(v: T) =>
 T extends string ? string : undefined*/

@Directive({
  selector: '[appFreePanelDirective]',
  standalone: true,
})
export class FreePanelDirective implements OnInit {
  elRef = inject(ElementRef)
  private noGridLayoutService = inject(NoGridLayoutService)
  private _panelId = ''
  private renderer = inject(Renderer2)
  cachedClass = ''
  cachedBorder = ''
  cachedBackgroundColor = ''
  defaultBgColor = BgColorBuilder('pink').toString()
  lineThroughBgColor = BgColorBuilder('blue').toString()

  constructor(private readonly zone: NgZone) {
  }

  @Input() set backgroundColor(backgroundColor: BackgroundColor) {
    console.log('backgroundColor', backgroundColor)
    this.zone.runOutsideAngular(() => {
      this.cachedBackgroundColor = this.manageClasses(backgroundColor, this.cachedBackgroundColor)
    })
  }

  @Input() set rotation(rotation: PanelRotationConfig) {
    console.log('rotation', rotation)
    const { width, height } = FreePanelUtil.size(rotation)
    this.renderer.setStyle(this.elRef.nativeElement, 'height', `${height}px`)
    this.renderer.setStyle(this.elRef.nativeElement, 'width', `${width}px`)
  }

  @Input() set borderColor(borderColorAndWidth: string) {
    console.log('border', borderColorAndWidth)
    if (borderColorAndWidth === this.cachedBorder) {
      return
    }
    this.cachedBorder.split(' ').forEach((c) => {
        const alreadyContains = this.elRef.nativeElement.classList.contains(c)
        if (!alreadyContains) return
        this.elRef.nativeElement.classList.remove(c)
      },
    )
    this.cachedBorder = borderColorAndWidth
    this.elRef.nativeElement.classList.add(...borderColorAndWidth.split(' '))
  }

  get panelId() {
    return this._panelId
  }

  ngOnInit() {
    console.log('FreePanelDirective.ngOnInit()')
    console.log('defaultBg', this.defaultBgColor)
    const border = 'border border-black'
    this.elRef.nativeElement.classList.add(...border.split(' '))
  }

  setStyle() {
    this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftGreen
    this.elRef.nativeElement.style.boxShadow = `0 0 0 2px ${SoftColor.SoftGreen}`
    this.elRef.nativeElement.classList.add('border-2')
  }

  private manageClasses(input: string, cached: string) {
    cached.split(' ').forEach((c) => {
        const alreadyContains = this.elRef.nativeElement.classList.contains(c)
        if (!alreadyContains) return
        this.elRef.nativeElement.classList.remove(c)
      },
    )
    cached = input
    this.elRef.nativeElement.classList.add(...input.split(' '))
    return cached
  }

  private setupTooltip() {
    const panelId = this.elRef.nativeElement.id
    console.log('setupTooltip panelId', panelId)
    tippy(this.elRef.nativeElement, {
      content: panelId,

    })
  }
}
