import { inject, Injectable } from '@angular/core'
import { DesignPanelFactory, isDesignEntityType, PanelRotation, PanelsStoreService } from '@design-app/feature-panel'
import { DesignEntityType } from '@design-app/shared'
import { SelectedStoreService } from '@design-app/feature-selected'
import { MousePositioningService } from 'design-app/utils'

@Injectable({
  providedIn: 'root',
})
export class DesignLayoutClickService {
  private _gridLayoutElement: HTMLDivElement | undefined
  private _mousePositionService = inject(MousePositioningService)
  private _selectedService = inject(SelectedStoreService)
  private _panelsStore = inject(PanelsStoreService)
  // private _designPanelsFacade = inject(DesignPanelsFacade)
  private _selectedFacade = inject(SelectedStoreService)
  clickedPanelId: string | undefined

  set gridLayoutElement(value: HTMLDivElement) {
    this._gridLayoutElement = value
  }

  get gridLayoutElement(): HTMLDivElement {
    if (!this._gridLayoutElement) throw new Error('gridLayoutElementRef is undefined')
    return this._gridLayoutElement
  }

  handleClickEvent(event: MouseEvent) {
    const isEntityInThisLocation = this.isEntityInThisLocation(event)
    if (isEntityInThisLocation) return

    if (event.ctrlKey) return

    const mouse = this._mousePositionService.getMousePositionFromPageXYWithSize(event)

    const size = DesignPanelFactory.size(PanelRotation.Default)
    const locationX = mouse.x - size.width / 2
    const locationY = mouse.y - size.height / 2

    /*    const freePanel = new FreePanelModel({
     x: locationX,
     y: locationY,
     })*/

    const panel = DesignPanelFactory.create({
      x: locationX,
      y: locationY,
    })

    // this._panelsStore.addPanel(freePanel)
    this._panelsStore.dispatch.addPanel(panel)
    // this._freePanelsService.addFreePanel(freePanel)
    this._selectedFacade.dispatch.clearSelectedState()
    // this._selectedService.clearSelected()
  }

  private isEntityInThisLocation(event: MouseEvent) {
    const type = (event.composedPath()[0] as HTMLDivElement).getAttribute('type') as DesignEntityType | undefined
    if (!type || !isDesignEntityType(type)) return false

    switch (type) {
      case DesignEntityType.Panel:
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
    // this._selectedService.setSelected(panelId)
    this._selectedFacade.dispatch.selectEntity({ id: panelId, type: DesignEntityType.Panel })
  }
}