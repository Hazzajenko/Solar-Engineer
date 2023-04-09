import { inject, Injectable, RendererFactory2 } from '@angular/core'
import { PanelFactory, PanelRotation, PanelsStoreService } from '@design-app/feature-panel'
import { EntityDivElement, EntityType, extractEntityDiv, extractHtmlDivElement, findParentContextMenuElement, findParentContextMenuElementV2 } from '@design-app/shared'
import { SelectedStoreService } from '@design-app/feature-selected'
import { ComponentElementsService, MousePositioningService, ObjectPositioningService } from 'design-app/utils'

@Injectable({
  providedIn: 'root',
})
export class DesignLayoutClickService {
  private _gridLayoutElement: HTMLDivElement | undefined
  private _mousePositionService = inject(MousePositioningService)
  private _selectedService = inject(SelectedStoreService)
  private _panelsStore = inject(PanelsStoreService)
  private _renderer = inject(RendererFactory2)
    .createRenderer(null, null)
  // private _designPanelsFacade = inject(DesignPanelsFacade)
  private _selectedFacade = inject(SelectedStoreService)
  private _objectPositioningService = inject(ObjectPositioningService)
  private _componentElementsService = inject(ComponentElementsService)
  menuIsOpen = false
  openMenuForEntity: EntityDivElement | undefined
  clickedPanelId: string | undefined

  set gridLayoutElement(value: HTMLDivElement) {
    this._gridLayoutElement = value
  }

  get gridLayoutElement(): HTMLDivElement {
    if (!this._gridLayoutElement) throw new Error('gridLayoutElementRef is undefined')
    return this._gridLayoutElement
  }

  public handleOpenMenus(event: MouseEvent) {
    if (this.openMenuForEntity) {
      this.closeMenuFromClick(event)
    }
  }

  public handleContextMenuEvent(event: PointerEvent) {
    if (this.openMenuForEntity) {
      this.closeMenu()
    }
    const isEntityInThisLocation = this.isEntityInThisLocationForRightClick(event)
    if (!isEntityInThisLocation) {
      return
    }

    return

  }

  public handleClickEvent(event: MouseEvent) {
    console.log('handleClickEvent', event)
    /*    if (this.openMenuForEntity) {
     this.closeMenuFromClick(event)
     }*/
    const isEntityInThisLocation = this.isEntityInThisLocation(event)
    if (isEntityInThisLocation) return

    const anyElement = extractHtmlDivElement(event)
    console.log('anyElement', anyElement)
    if (anyElement) {
      const isContextMenu = findParentContextMenuElementV2(anyElement)
      if (isContextMenu) {
        console.log('isContextMenu')
        return
      }
    }

    if (event.ctrlKey) return

    const mouse = this._mousePositionService.getMousePositionFromPageXYWithSize(event)

    const size = PanelFactory.size(PanelRotation.Default)
    const locationX = mouse.x - size.width / 2
    const locationY = mouse.y - size.height / 2

    /*    const freePanel = new FreePanelModel({
     x: locationX,
     y: locationY,
     })*/

    const panel = PanelFactory.create({
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
    const entityDiv = extractEntityDiv(event)
    if (!entityDiv) return false
    /*    const id = (event.composedPath()[0] as HTMLDivElement).getAttribute('id')
     if (!id) return false
     const type = (event.composedPath()[0] as HTMLDivElement).getAttribute('type') as EntityType | undefined
     if (!type || !isDesignEntityType(type)) return false*/

    switch (entityDiv.type) {
      case EntityType.Panel:
        this.handleClickPanelEvent(entityDiv)
        break
      default:
        console.error('unknown type', entityDiv.type)
        break
    }
    return true

  }

  private handleClickPanelEvent(entityDiv: EntityDivElement) {

    this.clickedPanelId = entityDiv.id
    // this._selectedService.setSelected(panelId)
    this._selectedFacade.dispatch.selectEntity({ id: entityDiv.id, type: EntityType.Panel })
  }

  private isEntityInThisLocationForRightClick(event: PointerEvent) {
    const entityDiv = extractEntityDiv(event)
    if (!entityDiv) return false

    switch (entityDiv.type) {
      case EntityType.Panel:
        this.handleRightClickPanel(entityDiv)
        break
      default:
        console.error('unknown type', entityDiv.type)
        break
    }
    return true

  }

  private handleRightClickPanel(entityDiv: EntityDivElement) {
    console.log('handleRightClickPanel', entityDiv)
    // get next sibling
    const nextSibling = entityDiv.element.nextElementSibling
    console.log('nextSibling', nextSibling)
    if (!nextSibling) return
    const entityRect = this._componentElementsService.getBlockRectFromElementV2(entityDiv.element)
    this.menuIsOpen = true
    this.openMenuForEntity = {
      ...entityDiv,
      element: nextSibling as HTMLDivElement,
    }
    // getBlockRectFromElementV2
    this._renderer.setStyle(nextSibling, 'display', 'block')
    this._renderer.setStyle(nextSibling, 'left', `${entityRect.x}px`)
    this._renderer.setStyle(nextSibling, 'top', `${entityRect.y}px`)
    /*    const srcElement = entityDiv.element
     const children = entityDiv.element.children
     console.log('children', children)
     const arrayOfChildren = Array.from(children)
     console.log('arrayOfChildren', arrayOfChildren)

     const menu = entityDiv.element.children.namedItem(`context-menu-${entityDiv.id}`)
     console.log('menu', menu)*/

  }

  private closeMenuFromClick(event: MouseEvent) {
    if (!this.openMenuForEntity) return
    const entityDiv = extractHtmlDivElement(event)
    if (!entityDiv) {
      this.closeMenu()
      return
    }
    const htmlDiv = findParentContextMenuElement(entityDiv)
    console.log('closeMenuFromClick', htmlDiv)
    if (!htmlDiv) {
      this.closeMenu()
      return
    }
    console.log('closeMenuFromClick', htmlDiv.id, this.openMenuForEntity.id)
    if (htmlDiv.id === `context-menu-${this.openMenuForEntity.id}`) return
    this.closeMenu()
  }

  private closeMenu() {
    if (!this.openMenuForEntity) return
    this._renderer.setStyle(this.openMenuForEntity.element, 'display', 'none')
    console.log('closeMenu set hidden', this.openMenuForEntity)
    this.menuIsOpen = false
    this.openMenuForEntity = undefined
  }
}