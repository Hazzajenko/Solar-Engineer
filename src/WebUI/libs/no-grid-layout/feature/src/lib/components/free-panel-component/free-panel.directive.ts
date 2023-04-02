import { Directive, ElementRef, inject, Input, NgZone, OnInit, Renderer2 } from '@angular/core'
import tippy from 'tippy.js'
import { BackgroundColor, FreePanelUtil, PanelColorState, PanelRotationConfig } from '@no-grid-layout/shared'
import { SelectedService } from '@no-grid-layout/data-access'
import { OnDestroyDirective } from '@shared/utils'
import { map, takeUntil, tap } from 'rxjs'

@Directive({
  selector:       '[appFreePanelDirective]',
  exportAs:       'freePanel',
  hostDirectives: [OnDestroyDirective],
  standalone:     true,
})
export class FreePanelDirective
  implements OnInit {
  private destroy$ = inject(OnDestroyDirective).destroy$
  elRef = inject(ElementRef)
  private _panelId = ''
  private renderer = inject(Renderer2)
  private _selectedService = inject(SelectedService)
  private readonly zone: NgZone = inject(NgZone)
  cachedClass = ''
  cachedBorder = ''
  cachedBackgroundColor = ''

  @Input() set backgroundColor(backgroundColor: BackgroundColor) {
    this.zone.runOutsideAngular(() => {
      this.cachedBackgroundColor = this.manageClasses(backgroundColor, this.cachedBackgroundColor)
    })
  }

  @Input() set rotation(rotation: PanelRotationConfig) {
    const { width, height } = FreePanelUtil.size(rotation)
    this.renderer.setStyle(this.elRef.nativeElement, 'height', `${height}px`)
    this.renderer.setStyle(this.elRef.nativeElement, 'width', `${width}px`)
  }

  @Input() set borderColor(borderColorAndWidth: string) {
    console.log('border', borderColorAndWidth)
    if (borderColorAndWidth === this.cachedBorder) {
      return
    }
    this.cachedBorder.split(' ')
      .forEach((c) => {
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
    this._panelId = this.elRef.nativeElement.id
    const border = 'border border-black'
    this.elRef.nativeElement.classList.add(...border.split(' '))
    this._selectedService.selected$
      .pipe(
        takeUntil(this.destroy$),
        map((selected) => selected === this.panelId),
        tap((isSelected) => {
            this.zone.runOutsideAngular(() => {
              if (isSelected) {
                this.cachedBackgroundColor = this.replaceClassForPanel(PanelColorState.Default, PanelColorState.Selected)
                return
              }
              this.cachedBackgroundColor = this.replaceClassForPanel(PanelColorState.Selected, PanelColorState.Default)
            })
          },
        ),
      )
      .subscribe()
  }

  private replaceClassForPanel(oldClass: string, newClass: string) {
    if (this.elRef.nativeElement.classList.contains(newClass)) return newClass
    this.renderer.removeClass(this.elRef.nativeElement, oldClass)
    this.renderer.addClass(this.elRef.nativeElement, newClass)
    return newClass
  }

  private manageClasses(input: string, cached: string) {
    cached.split(' ')
      .forEach((c) => {
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
