import { Directive, ElementRef, inject, Input, NgZone, OnInit, Renderer2 } from '@angular/core'
import tippy from 'tippy.js'
import { BackgroundColor, FreePanelUtil, PanelColorState, PanelRotationConfig } from '@no-grid-layout/shared'
import { SelectedService } from '@no-grid-layout/data-access'
import { OnDestroyDirective } from '@shared/utils'
import { map, takeUntil, tap } from 'rxjs'
import { ComponentElementsService } from '@no-grid-layout/utils'

@Directive({
  selector:       '[appFreePanelDirective]',
  exportAs:       'freePanel',
  hostDirectives: [OnDestroyDirective],
  standalone:     true,
})
export class FreePanelDirective
  implements OnInit {
  private destroy$ = inject(OnDestroyDirective).destroy$
  private _element = inject(ElementRef).nativeElement
  // elRef = inject(ElementRef)
  private _panelId = ''
  private renderer = inject(Renderer2)
  private _selectedService = inject(SelectedService)
  // private _tippy: tippy.Instance | null = null
  private _componentElementsService = inject(ComponentElementsService)
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
    this.renderer.setStyle(this._element, 'height', `${height}px`)
    this.renderer.setStyle(this._element, 'width', `${width}px`)
  }

  @Input() set borderColor(borderColorAndWidth: string) {
    console.log('border', borderColorAndWidth)
    if (borderColorAndWidth === this.cachedBorder) {
      return
    }
    this.cachedBorder.split(' ')
      .forEach((c) => {
          const alreadyContains = this._element.classList.contains(c)
          if (!alreadyContains) return
          this._element.classList.remove(c)
        },
      )
    this.cachedBorder = borderColorAndWidth
    this._element.classList.add(...borderColorAndWidth.split(' '))
  }

  get panelId() {
    return this._panelId
  }

  ngOnInit() {
    this._panelId = this._element.id
    const border = 'border border-black'
    this._element.classList.add(...border.split(' '))
    this._componentElementsService.addToElements(this._element)
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
    if (this._element.classList.contains(newClass)) return newClass
    this.renderer.removeClass(this._element, oldClass)
    this.renderer.addClass(this._element, newClass)
    return newClass
  }

  private manageClasses(input: string, cached: string) {
    cached.split(' ')
      .forEach((c) => {
          const alreadyContains = this._element.classList.contains(c)
          if (!alreadyContains) return
          this._element.classList.remove(c)
        },
      )
    cached = input
    this._element.classList.add(...input.split(' '))
    return cached
  }

  private setupTooltip() {
    const panelId = this._element.id
    console.log('setupTooltip panelId', panelId)
    tippy(this._element, {
      content: panelId,

    })
  }
}
