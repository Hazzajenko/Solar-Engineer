import { Directive, ElementRef, inject, Input, NgZone, OnInit, Renderer2 } from '@angular/core'
import tippy from 'tippy.js'
import { OnDestroyDirective } from '@shared/utils'
import { SoftColor, StyleName, VibrantColor } from '@shared/data-access/models'
import { DesignPanelFactory, PanelBackgroundColor, PanelBorder, PanelRotation, SelectedPanelState } from '../types'
import { PanelStylerService } from '../services'
import { ComponentElementsService } from 'design-app/utils'

@Directive({
  selector:       '[appDesignPanel]',
  hostDirectives: [OnDestroyDirective],
  standalone:     true,
})
export class DesignPanelDirective
  implements OnInit {
  private destroy$ = inject(OnDestroyDirective).destroy$
  private _element = inject(ElementRef).nativeElement
  private _renderer = inject(Renderer2)
  private _ngZone = inject(NgZone)
  private _panelId = ''
  private renderer = inject(Renderer2)
  private _componentElementsService = inject(ComponentElementsService)
  private _panelStylerService = inject(PanelStylerService)
  private readonly zone: NgZone = inject(NgZone)
  isSelected = false
  isMultiSelected = false
  cachedClass = ''
  cachedBorder = ''
  cachedBackgroundColor = ''

  backgroundColorStyles = {
    Default:       SoftColor.SoftBrown,
    Red:           VibrantColor.VibrantRed,
    Green:         VibrantColor.VibrantGreen,
    MultiSelected: VibrantColor.VibrantYellow,
    Orange:        VibrantColor.VibrantOrange,
    Nearby:        VibrantColor.VibrantPurple,
  }

  @Input() set rotation(rotation: PanelRotation) {
    const { width, height } = DesignPanelFactory.size(rotation)
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

  @Input() set selected(selected: SelectedPanelState) {
    if (!selected) return
    this.zone.runOutsideAngular(() => {
      this.isSelected = selected === this.panelId
      this.isMultiSelected = selected.includes(this.panelId)
      if (selected === SelectedPanelState.SingleSelected) {
        this.setStyle(StyleName.Border, PanelBorder.Selected)
        this.setStyle(StyleName.BackgroundColor, SoftColor.SoftCyan)
      }
      if (selected === SelectedPanelState.MultiSelected) {
        this.setStyle(StyleName.Border, PanelBorder.Selected)
        this.setStyle(StyleName.BackgroundColor, SoftColor.SoftCyan)
      }
      if (selected === SelectedPanelState.NoneSelected) {
        this.setStyle(StyleName.Border, PanelBorder.Default)
        this.setStyle(StyleName.BackgroundColor, PanelBackgroundColor.Default)
      }

      // this.setStyle('background-color', this.isSelected ? SoftColor.SoftCyan : PanelBackgroundColor.Default)
      // this.setStyle('border', this.isSelected ? PanelBorder.Selected : PanelBorder.Default)
    })
  }

  get panelId() {
    return this._panelId
  }

  ngOnInit() {
    this._panelId = this._element.id
    // const border = 'border border-black'
    // this._element.classList.add(...border.split(' '))
    const borderStyle = '1px solid black'
    this.setStyle('border', borderStyle)
    this.setStyle('background-color', PanelBackgroundColor.Default)
    this._componentElementsService.addToElements(this._element)
    this._panelStylerService.initPanelStyleState(this._element.id)
    this.setupMouseEventListeners()

    /*this._selectedService.selected$
     .pipe(
     takeUntil(this.destroy$),
     map((selected) => selected === this.panelId),
     tap((isSelected) => {
     this.zone.runOutsideAngular(() => {
     if (isSelected) {
     this.setStyle(StyleName.Border, PanelBorder.Selected)
     this.setStyle(StyleName.BackgroundColor, SoftColor.SoftCyan)
     // this.setStyle(StyleName.BackgroundColor, PanelBackgroundColor.Red)
     // this.setStyle('background-color', PanelBackgroundColor.Red)
     /!*               this.cachedBackgroundColor =
     this.replaceClassForPanel(this.cachedBackgroundColor, PanelColorState.Selected)*!/
     return
     }
     this.setStyle('background-color', PanelBackgroundColor.Default)
     this.setStyle(StyleName.Border, PanelBorder.Default)
     // this.cachedBackgroundColor = this.replaceClassForPanel(this.cachedBackgroundColor, PanelColorState.Default)
     })
     },
     ),
     )
     .subscribe()

     this._selectedService.multiSelected$
     .pipe(
     takeUntil(this.destroy$),
     map((selected) => selected.includes(this.panelId)),
     tap((isSelected) => {
     this.zone.runOutsideAngular(() => {
     if (isSelected) {
     this.setStyle('background-color', SoftColor.SoftCyan)
     // this.setStyle('background-color', PanelBackgroundColor.MultiSelected)
     /!*                this.cachedBackgroundColor =
     this.replaceClassForPanel(this.cachedBackgroundColor, PanelColorState.MultiSelected)*!/
     return
     }
     this.setStyle('background-color', PanelBackgroundColor.Default)
     /!*         this.cachedBackgroundColor =
     this.replaceClassForPanel(this.cachedBackgroundColor, PanelColorState.Default)*!/
     })
     },
     ),
     )
     .subscribe()*/

  }

  private setupMouseEventListeners() {
    /*    this._ngZone.runOutsideAngular(() => {
     this._renderer.listen(this._element, EventName.MouseOver, (event: MouseEvent) => {
     event.stopPropagation()
     event.preventDefault()
     this.onMouseOverHandler(event)
     })
     this._renderer.listen(this._element, EventName.MouseLeave, (event: MouseEvent) => {
     event.stopPropagation()
     event.preventDefault()
     this.onMouseLeaveHandler(event)
     })
     /!*      this._renderer.listen(this._element, EventName.Click, (event: PointerEvent) => {
     event.stopPropagation()
     event.preventDefault()
     this.onMouseClickHandler(event)
     })*!/
     })*/
  }

  private onMouseOverHandler(event: MouseEvent) {
    // console.log('over', event)
    this.setStyle(StyleName.BackgroundColor, PanelBackgroundColor.Hover)
  }

  private onMouseLeaveHandler(event: MouseEvent) {
    // console.log('leave', event)
    if (this.isSelected) {
      this.setStyle(StyleName.BackgroundColor, PanelBackgroundColor.Selected)
      return
    }
    if (this.isMultiSelected) {
      this.setStyle(StyleName.BackgroundColor, PanelBackgroundColor.MultiSelected)
      return
    }
    this.setStyle(StyleName.BackgroundColor, PanelBackgroundColor.Default)
  }

  /*
   private onMouseClickHandler(event: PointerEvent) {
   console.log('click', event)
   this.setStyle(StyleName.BackgroundColor, PanelBackgroundColor.Selected)
   }*/

  private replaceClassForPanel(oldClass: string, newClass: string) {
    if (this._element.classList.contains(newClass)) return newClass
    this.renderer.removeClass(this._element, oldClass)
    this.renderer.addClass(this._element, newClass)
    return newClass
  }

  private setStyle(style: string, value: string) {
    this.renderer.setStyle(this._element, style, value)
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
