import { inject, Injectable } from '@angular/core'
import { FreeBlockType, FreePanelModel, FreePanelUtil, isFreeBlockType, PanelRotationConfig } from '@no-grid-layout/shared'
import { MousePositionService } from './mouse-position.service'
import { FreePanelsService, SelectedService } from '@no-grid-layout/data-access'

@Injectable({
  providedIn: 'root',
})
export class ClickService {
  private _gridLayoutElement: HTMLDivElement | undefined
  private _mousePositionService = inject(MousePositionService)
  private _selectedService = inject(SelectedService)
  private _freePanelsService = inject(FreePanelsService)
  clickedPanelId: string | undefined

  set gridLayoutElement(value: HTMLDivElement) {
    this._gridLayoutElement = value
  }

  get gridLayoutElement(): HTMLDivElement {
    if (!this._gridLayoutElement) throw new Error('gridLayoutElementRef is undefined')
    return this._gridLayoutElement
  }

  handleClickEvent(event: MouseEvent) {
    const isBlockInThisLocation = this.isBlockInThisLocation(event)
    if (isBlockInThisLocation) return

    if (event.ctrlKey) return

    const mouse = this._mousePositionService.getMousePositionFromPageXYWithSize(event)

    const size = FreePanelUtil.size(PanelRotationConfig.Default)
    const locationX = mouse.x - size.width / 2
    const locationY = mouse.y - size.height / 2

    const freePanel = new FreePanelModel({
      x: locationX,
      y: locationY,
    })

    this._freePanelsService.addFreePanel(freePanel)
  }

  private isBlockInThisLocation(event: MouseEvent) {
    const type = (event.composedPath()[0] as HTMLDivElement).getAttribute('type') as FreeBlockType | undefined
    if (!type || !isFreeBlockType(type)) return false

    switch (type) {
      case FreeBlockType.Panel:
        this.handleClickPanelEvent(event)
        break
      default:
        console.error('unknown type', type)
        break
    }
    return true

  }

  private handleClickPanelEvent(event: MouseEvent) {
    const panelId = (event.composedPath()[0] as HTMLDivElement).getAttribute('panelId')
    if (!panelId) {
      console.error('panelId not found')
      return
    }
    this.clickedPanelId = panelId
    this._selectedService.setSelected(panelId)
  }
}