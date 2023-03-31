import { inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core'
import { LineDirectionEnum } from './line-direction.enum'
import { BgColorBuilder } from './bg-color.builder'
import { NoGridLayoutService } from './no-grid-layout.service'
import { FreeBlockRectModel } from './free-block-rect.model'
import { UpdateStr } from '@ngrx/entity/src/models'
import { FreePanelModel } from '@no-grid-layout/feature'

@Injectable({
  providedIn: 'root',
})
export class PanelStylerService {
  private noGridLayoutService = inject(NoGridLayoutService)
  // private freePanelsFacade = inject(FreePanelsFacade)
  private renderer: Renderer2
  panelsInLineToRight: string[] = []
  panelsInLineToLeft: string[] = []
  panelsInLineToTop: string[] = []
  panelsInLineToBottom: string[] = []

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null)
  }

  /*  constructor(private renderer: Renderer2) {
   }*/

  lightUpClosestPanel(blockRectModel: FreeBlockRectModel, direction: LineDirectionEnum) {
    // console.log('lightUpClosestPanel', blockRectModel, direction)
    const panels = document.querySelectorAll('[panelId]')
    if (!panels) {
      return
    }
    const panelDiv = Array.from(panels).find(p => p.getAttribute('panelId') === blockRectModel.id)
    if (!panelDiv) {
      return
    }
    const handleCanvas = (arr: string[], blockRectModelId: string) => {
      if (!arr.includes(blockRectModel.id)) {
        arr.push(blockRectModel.id)
      }

      // const panel = await firstValueFrom(this.freePanelsFacade.getFreePanelById(blockRectModelId))

      const panel = this.noGridLayoutService.getPanelById2(blockRectModelId)
      if (!panel) {
        return
      }
      const bgBlue = BgColorBuilder('blue').toString()

      if (panel.backgroundColor === bgBlue) return
      // panel.backgroundColor = bgBlue
      const update: UpdateStr<FreePanelModel> = {
        id: panel.id,
        changes: {
          backgroundColor: bgBlue,
        },
      }
      // console.log('update', update)
      this.renderer.removeClass(panelDiv, panel.backgroundColor)
      this.renderer.addClass(panelDiv, bgBlue)
      // this.freePanelsFacade.updateFreePanel(update)
      // this.noGridLayoutService.updateFreePanel(panel)

    }
    switch (direction) {
      case LineDirectionEnum.Top:
        handleCanvas(this.panelsInLineToTop, blockRectModel.id)
        break
      case LineDirectionEnum.Bottom:
        handleCanvas(this.panelsInLineToBottom, blockRectModel.id)
        break
      case LineDirectionEnum.Left:
        handleCanvas(this.panelsInLineToLeft, blockRectModel.id)
        break
      case LineDirectionEnum.Right:
        handleCanvas(this.panelsInLineToRight, blockRectModel.id)
        break
      default:
        break
    }
  }

  removePanelClassForLightUpPanels(directionEnum: LineDirectionEnum) {
    // console.log('removePanelClassForLightUpPanels', directionEnum)
    const handleCanvas = (arr: string[]) => {
      for (const id of arr) {
        const panel = this.noGridLayoutService.getPanelById2(id)
        // const panel = await firstValueFrom(this.freePanelsFacade.getFreePanelById(id))

        if (!panel) continue

        // this.renderer.
        const pinkBg = BgColorBuilder('pink').toString()
        // if (panel.backgroundColor === pinkBg) continue
        /*        const update: UpdateStr<FreePanelModel> = {
         id: panel.id,
         changes: {
         backgroundColor: pinkBg,
         },
         }*/
        const panels = document.querySelectorAll('[panelId]')
        if (!panels) {
          return
        }
        const panelDiv = Array.from(panels).find(p => p.getAttribute('panelId') === id)
        if (!panelDiv) {
          return
        }
        const alreadyPink = panelDiv.classList.contains(pinkBg)
        if (alreadyPink) continue
        console.log('removePanelClassForLightUpPanels', panelDiv)
        this.renderer.removeClass(panelDiv, 'bg-blue-500')
        this.renderer.addClass(panelDiv, pinkBg)
        // this.freePanelsFacade.updateFreePanel(update)
        // panel.backgroundColor = pinkBg
        // this.noGridLayoutService.updateFreePanel(panel)
      }
    }
    switch (directionEnum) {
      case LineDirectionEnum.Top:
        handleCanvas(this.panelsInLineToTop)
        break
      case LineDirectionEnum.Bottom:
        handleCanvas(this.panelsInLineToBottom)
        break
      case LineDirectionEnum.Left:
        handleCanvas(this.panelsInLineToLeft)
        break
      case LineDirectionEnum.Right:
        handleCanvas(this.panelsInLineToRight)
        break
      default:
        break
    }
  }
}