import { Directive, ElementRef, inject, Input, NgZone, OnInit, Renderer2 } from '@angular/core'

import { SoftColor } from '@shared/data-access/models'
import tippy from 'tippy.js'
import { NoGridLayoutService } from '../../no-grid-layout.service'
import { BackgroundColor, BgColorBuilder } from '../../bg-color.builder'
import { FreePanelBlockConfig, PanelRotationConfig } from '../../configs/free-panel-block.config'

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
  /*  border$ = this.noGridLayoutService.getPanelById(this._panelId).pipe(
   map((panel) => panel?.borderColorAndWidth),
   tap((borderColorAndWidth) => {
   if (!borderColorAndWidth) return
   if (borderColorAndWidth === this.cachedBorder) {
   return
   }

   this.cachedBorder = borderColorAndWidth
   // const classes = 'border border-black border-2'
   this.elRef.nativeElement.classList.add(...borderColorAndWidth.split(' '))
   },
   ),
   )*/

  // classForPanel

  constructor(private readonly zone: NgZone) {
  }

  /*  @Input() set panel(panel: FreePanelModel) {
   if (panel.borderColorAndWidth === this.cachedBorder) {
   return
   }

   this.cachedBorder = panel.borderColorAndWidth
   // const classes = 'border border-black border-2'
   this.elRef.nativeElement.classList.add(...panel.borderColorAndWidth.split(' '))
   // this.elRef.nativeElement.classList.add(panel.borderColorAndWidth)
   }*/

  @Input() set backgroundColor(backgroundColor: BackgroundColor) {
    console.log('backgroundColor', backgroundColor)
    /*    if (backgroundColor === this.cachedBackgroundColor) {
     return
     }*/
    this.zone.runOutsideAngular(() => {
      this.cachedBackgroundColor = this.manageClasses(backgroundColor, this.cachedBackgroundColor)
    })
  }

  @Input() set rotation(rotation: PanelRotationConfig) {
    console.log('rotation', rotation)
    // this.elRef.nativeElement.style.transform = `rotate(${rotation.degrees}deg)`
    // this.elRef.nativeElement.s
    const { width, height } = FreePanelBlockConfig.size(rotation)
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
    // check if a class is already applied
    // this.elRef.nativeElement.classList.remove(...this.cachedBorder.split(' '))
    this.cachedBorder = borderColorAndWidth
    // const classes = 'border border-black border-2'
    this.elRef.nativeElement.classList.add(...borderColorAndWidth.split(' '))
  }

  /*  @Input() set panelId(panelId: string) {
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
   }*/

  get panelId() {
    return this._panelId
  }

  ngOnInit() {
    console.log('FreePanelDirective.ngOnInit()')
    // const defaultBg = BgColorBuilder('pink').toString()
    // const defaultBg = BgColorBuilder('blue').toString()
    console.log('defaultBg', this.defaultBgColor)
    const border = 'border border-black'
    this.elRef.nativeElement.classList.add(...border.split(' '))

    // this.cachedBackgroundColor = this.manageClasses(this.defaultBgColor, this.cachedBackgroundColor)
    // this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftGreen
    // this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftBrown
    // this.border$.subscribe()

    // this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftBrown
    // this.elRef.nativeElement.style.backgroundColor = '#95c2fa'
    // this.elRef.nativeElement.style.boxShadow = ``
    /*    this.zone.runOutsideAngular(() => {
     this.setupTooltip()
     })*/
    // this.noGridLayoutService.panelsHaveClass
  }

  setStyle() {
    this.elRef.nativeElement.style.backgroundColor = SoftColor.SoftGreen
    this.elRef.nativeElement.style.boxShadow = `0 0 0 2px ${SoftColor.SoftGreen}`
    this.elRef.nativeElement.classList.add('border-2')
  }

  private manageClasses(input: string, cached: string) {
    /*    if (input === cached) {
     return
     }*/
    cached.split(' ').forEach((c) => {
        const alreadyContains = this.elRef.nativeElement.classList.contains(c)
        if (!alreadyContains) return
        this.elRef.nativeElement.classList.remove(c)
      },
    )
    cached = input
    this.elRef.nativeElement.classList.add(...input.split(' '))
    // cleanVar(cached)
    return cached
    // return cached as string
  }

  private setupTooltip() {
    const panelId = this.elRef.nativeElement.id
    console.log('setupTooltip panelId', panelId)
    tippy(this.elRef.nativeElement, {
      content: panelId,

    })
  }
}
