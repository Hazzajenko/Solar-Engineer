import { inject, Injectable, RendererFactory2 } from '@angular/core'
import { FreeBlockRectModel, LineDirectionEnum, PanelColorState } from '@no-grid-layout/shared'
import { ComponentElementService } from './component-element.service'
import { Logger } from 'tslog'

const DirectionArrayMap: { [key in LineDirectionEnum]: DirectionArray } = {
  [LineDirectionEnum.Top]:    'panelsInLineToTop',
  [LineDirectionEnum.Bottom]: 'panelsInLineToBottom',
  [LineDirectionEnum.Left]:   'panelsInLineToLeft',
  [LineDirectionEnum.Right]:  'panelsInLineToRight',
}
type DirectionArray = 'panelsInLineToTop' | 'panelsInLineToBottom' | 'panelsInLineToLeft' | 'panelsInLineToRight'

@Injectable({
  providedIn: 'root',
})
export class PanelStylerService {
  private renderer = inject(RendererFactory2)
    .createRenderer(null, null)
  private _componentElementService = inject(ComponentElementService)
  private _logger = new Logger({ name: 'PanelStylerService' })
  private panelsInLineToRight: string[] = []
  private panelsInLineToLeft: string[] = []
  private panelsInLineToTop: string[] = []
  private panelsInLineToBottom: string[] = []
  private panelToElementMap: Map<string, Element> = new Map<string, Element>()

  enableSelectedPanelClass(selectedId: string) {
    this.replaceClassForPanelById(selectedId, PanelColorState.Default, PanelColorState.Selected)
  }

  disableSelectedPanelClass(selectedId: string) {
    this.replaceClassForPanelById(selectedId, PanelColorState.Selected, PanelColorState.Default)
  }

  lightUpClosestPanel(blockRectModel: FreeBlockRectModel, direction: LineDirectionEnum) {
    const panelElementRef = this._componentElementService.getComponentElementById(blockRectModel.id)
    if (!panelElementRef) {
      this._logger.warn(`No panel found for id ${blockRectModel.id}`)
      return
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
    this.replaceClassForPanelByElement(panelDiv, PanelColorState.Default, PanelColorState.LineThrough)
  }

  private leaveDirectionArray(arrName: DirectionArray) {
    for (const id of this[arrName]) {
      this.replaceClassForPanelById(id, PanelColorState.LineThrough, PanelColorState.Default)
    }
    this[arrName] = []
  }

  private replaceClassForPanelById(panelId: string, oldClass: string, newClass: string) {
    const panelDiv = this._componentElementService.getComponentElementById(panelId)
    if (!panelDiv) {
      this._logger.warn(`No panel found for id ${panelId}`)
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