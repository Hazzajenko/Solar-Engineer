import { inject, Injectable, RendererFactory2 } from '@angular/core'
import { LineDirectionEnum } from './line-direction.enum'
import { FreeBlockRectModel } from './free-block-rect.model'
import { FreePanelBgStates } from './color-config'
import { getPanelElementById } from './functions'

const DirectionArrayMap: { [key in LineDirectionEnum]: DirectionArray } = {
  [LineDirectionEnum.Top]: 'panelsInLineToTop',
  [LineDirectionEnum.Bottom]: 'panelsInLineToBottom',
  [LineDirectionEnum.Left]: 'panelsInLineToLeft',
  [LineDirectionEnum.Right]: 'panelsInLineToRight',
}
type DirectionArray = 'panelsInLineToTop' | 'panelsInLineToBottom' | 'panelsInLineToLeft' | 'panelsInLineToRight'

@Injectable({
  providedIn: 'root',
})
export class PanelStylerService {
  private renderer = inject(RendererFactory2).createRenderer(null, null)
  private panelsInLineToRight: string[] = []
  private panelsInLineToLeft: string[] = []
  private panelsInLineToTop: string[] = []
  private panelsInLineToBottom: string[] = []
  private panelToElementMap: Map<string, Element> = new Map<string, Element>()

  lightUpClosestPanel(blockRectModel: FreeBlockRectModel, direction: LineDirectionEnum) {

    let panelElementRef: Element | null = null
    if (blockRectModel.element) {
      panelElementRef = blockRectModel.element
    } else {
      const elementFromCache = this.panelToElementMap.get(blockRectModel.id)
      if (elementFromCache) {
        panelElementRef = elementFromCache
      } else {
        const panelDivQuery = getPanelElementById(blockRectModel.id)
        if (!panelDivQuery) {
          return
        }
        panelElementRef = panelDivQuery
        this.panelToElementMap.set(blockRectModel.id, panelElementRef)
      }
    }
    this.pushToDirectionArray(DirectionArrayMap[direction], blockRectModel.id, panelElementRef)
  }

  removePanelClassForLightUpPanels(directionEnum: LineDirectionEnum) {
    this.leaveDirectionArray(DirectionArrayMap[directionEnum])
  }

  private pushToDirectionArray(arrName: DirectionArray, panelId: string, panelDiv: Element) {
    if (!this[arrName].includes(panelId)) {
      this[arrName].push(panelId)
    }
    this.replaceClassForPanelByElement(panelDiv, FreePanelBgStates.Default, FreePanelBgStates.LineThrough)
  }

  private leaveDirectionArray(arrName: DirectionArray) {
    for (const id of this[arrName]) {
      this.replaceClassForPanelById(id, FreePanelBgStates.LineThrough, FreePanelBgStates.Default)
    }
    this[arrName] = []
  }

  private replaceClassForPanelById(panelId: string, oldClass: string, newClass: string) {
    /*    try {
     const panelDiv = document.querySelector(`[panelId=${panelId}]`)
     if (!panelDiv) {
     console.error('panelDiv not found', panelId)
     return
     }
     if (panelDiv.classList.contains(newClass)) return
     this.renderer.removeClass(panelDiv, oldClass)
     this.renderer.addClass(panelDiv, newClass)
     } catch (e) {
     console.error('panelDiv not found', panelId, e)
     }*/

    const panels = document.querySelectorAll('[panelId]')
    if (!panels) {
      return
    }
    const panelDiv = Array.from(panels).find(p => p.getAttribute('panelId') === panelId)
    if (!panelDiv) {
      return
    }
    if (panelDiv.classList.contains(newClass)) return
    this.renderer.removeClass(panelDiv, oldClass)
    this.renderer.addClass(panelDiv, newClass)
  }

  private replaceClassForPanelByElement(panelEl: Element, oldClass: string, newClass: string) {
    if (panelEl.classList.contains(newClass)) return
    this.renderer.removeClass(panelEl, oldClass)
    this.renderer.addClass(panelEl, newClass)
  }
}