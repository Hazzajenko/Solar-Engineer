import { inject, Injectable, NgZone, RendererFactory2 } from '@angular/core'
import { FreeBlockRectModel, LineDirection, LineDirectionEnum, PanelColorState } from '@no-grid-layout/shared'
import { ComponentElementsService } from '../component-elements.service'
import { assertNotNull } from '@shared/utils'
import { PanelStylerFields } from './panel-styler.fields'
import { PanelBackgroundColor, PanelStyleState } from './panel-style-state.model'
import { StyleName } from '@shared/data-access/models'

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
export class PanelStylerService
  extends PanelStylerFields {
  private _renderer = inject(RendererFactory2)
    .createRenderer(null, null)
  private _componentElementService = inject(ComponentElementsService)
  private _ngZone = inject(NgZone)
  // private _logger = new Logger({ name: 'PanelStylerService' })
  private panelsInLineToRight: string[] = []
  private panelsInLineToLeft: string[] = []
  private panelsInLineToTop: string[] = []
  private panelsInLineToBottom: string[] = []
  // private _panelsNearBy: string[] = []
  private panelToElementMap: Map<string, Element> = new Map<string, Element>()

  enableSelectedPanelClass(selectedId: string) {
    this.replaceClassForPanelById(selectedId, PanelColorState.Default, PanelColorState.Selected)
  }

  disableSelectedPanelClass(selectedId: string) {
    this.replaceClassForPanelById(selectedId, PanelColorState.Selected, PanelColorState.Default)
  }

  public addNearbyPanel(blockRectModel: FreeBlockRectModel, direction: LineDirection) {
    // this.lightUpClosestPanel(blockRectModel, direction)
    const panelElement = this._componentElementService.getComponentElementById(blockRectModel.id)
    assertNotNull(panelElement, `No panel element found for id ${blockRectModel.id}`)

    const nearbyPanel = {
      id: blockRectModel.id,
      direction,
    }
    if (this.nearbyPanels.map(x => x.id)
      .includes(nearbyPanel.id)) {
      return
    }
    this.nearbyPanels = [
      ...this.nearbyPanels,
      nearbyPanel,
    ]
    // this.pushToNearbyPanels(nearbyPanel)
    // console.log('set nearbyPanels', value)
    // this.nearbyPanels.push(nearbyPanel)
    this.setStyleForPanelByElement(panelElement, 'background-color', PanelBackgroundColor.Nearby)
    console.log('this.nearbyPanels', this.nearbyPanels)
    // this.setStyleForPanelById(blockRectModel.id, 'background-color', PanelColorConfig.Purple)
    /*    this.nearbyPanels.push({
     id:      blockRectModel.id,
     element: panelElement,
     direction,
     })*/
  }

  public removeFromNearbyPanelsByDirection(direction: LineDirection) {
    /*    if (this.nearbyPanels.length === 0) {
     return
     }
     this.nearbyPanels = this.nearbyPanels.filter((p) => p.direction !== direction)*/
    this.panelStyleStates = this.panelStyleStates.map((p) => {
      if (p.direction === direction) {
        p.direction = undefined
        if (p.backgroundColor === PanelBackgroundColor.Nearby) {
          p.backgroundColor = PanelBackgroundColor.Default
          this.setBackgroundColorForPanelById(p.id, PanelBackgroundColor.Default)
        }
        /*        p.backgroundColor = PanelBackgroundColor.Default
         this.setBackgroundColorForPanelById(p.id, PanelBackgroundColor.Default)*/
      }
      return p
    })
  }

  public doesPanelHaveNearbyPanelsStyle(id: string) {
    return this.panelStyleStates
             .find(p => p.id === id)
             ?.backgroundColor === PanelBackgroundColor.Nearby
  }

  /*  public clearNearbyPanels(direction: LineDirection) {
   const nearbyPanels = this.nearbyPanels.filter(p => p.direction === direction)
   if (nearbyPanels.length === 0) {
   return
   }
   nearbyPanels
   .forEach(p => {
   this.setStyleForPanelByElement(p.element, 'background-color', PanelColorConfig.Default)
   })
   this.nearbyPanels = this.nearbyPanels.filter(p => p.direction !== direction)
   }*/

  lightUpClosestPanel(blockRectModel: FreeBlockRectModel, direction: LineDirectionEnum) {
    const panelElementRef = this._componentElementService.getComponentElementById(blockRectModel.id)
    if (!panelElementRef) {
      console.error(`No panel found for id ${blockRectModel.id}`)
      // this._logger.warn(`No panel found for id ${blockRectModel.id}`)
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
    this.setStyleForPanelByElement(panelDiv, 'background-color', PanelBackgroundColor.LineThrough)
    // this.setStyleForPanelById(panelId, 'background-color', PanelColorConfig.LightRed)
    // this.replaceClassForPanelByElement(panelDiv, PanelColorState.Default, PanelColorState.LineThrough)
  }

  private leaveDirectionArray(arrName: DirectionArray) {
    for (const id of this[arrName]) {
      this.setStyleForPanelById(id, 'background-color', PanelBackgroundColor.Default)
      // this.replaceClassForPanelById(id, PanelColorState.LineThrough, PanelColorState.Default)
    }
    this[arrName] = []
  }

  setStyleForPanelById(panelId: string, styleName: StyleName, styleValue: string) {
    const panelDiv = this._componentElementService.getComponentElementById(panelId)
    assertNotNull(panelDiv, `No panel found for id ${panelId}`)
    this._ngZone.runOutsideAngular(() => {
        this._renderer.setStyle(panelDiv, styleName, styleValue)
      },
    )
    /*const panelStyleState = this.panelStyleStates.find(p => p.id === panelId)
     if (panelStyleState) {
     switch (styleName) {
     case 'background-color':

     panelStyleState.backgroundColor = styleValue
     }
     // panelStyleState.backgroundColor
     // panelStyleState[styleName]
     return
     }
     this.panelStyleStates[panelId] = {
     ...this.panelStyleStates[panelId],
     [styleName]: styleValue,
     }*/
  }

  public initPanelStyleState(panelId: string) {
    const panelStyleState = this.panelStyleStates.find(p => p.id === panelId)
    if (panelStyleState) {
      return
    }
    const newPanelStyleState: PanelStyleState = {
      id:              panelId,
      backgroundColor: PanelBackgroundColor.Default,
      direction:       undefined,
    }
    this.pushToPanelStyleStates(newPanelStyleState)
    this.setBackgroundColorForPanelById(panelId, PanelBackgroundColor.Default)
    /*   this.panelStyleStates.push({
     id: panelId,
     backgroundColor: PanelBackgroundColor.Default,
     direction: undefined,
     }*/
    // )

  }

  setBackgroundColorForPanelById(panelId: string, backgroundColor: PanelBackgroundColor, direction?: LineDirection) {
    const panelDiv = this._componentElementService.getComponentElementById(panelId)
    assertNotNull(panelDiv, `No panel found for id ${panelId}`)
    this._ngZone.runOutsideAngular(() => {
        this._renderer.setStyle(panelDiv, StyleName.BackgroundColor, backgroundColor)
      },
    )
    const panelStyleStates = this.panelStyleStates
    const index = panelStyleStates.findIndex((fp) => fp.id === panelId)
    if (index === -1) {
      const newPanelStyleState: PanelStyleState = {
        id: panelId,
        backgroundColor,
        direction,
      }
      panelStyleStates.push(newPanelStyleState)
      this.panelStyleStates = panelStyleStates
      this._renderer.setStyle(panelDiv, StyleName.BackgroundColor, backgroundColor)
      return
    }

    this.updatePanelStyleState(panelId, {
      backgroundColor,
      direction,
    })

    /*    panelStyleStates[index].backgroundColor = backgroundColor
     panelStyleStates[index].direction = direction
     this.panelStyleStates = panelStyleStates*/

  }

  private setStyleForPanelByElement(panelEl: Element, styleName: string, styleValue: string) {
    this._ngZone.runOutsideAngular(() => {
      this._renderer.setStyle(panelEl, styleName, styleValue)
      // console.log('setStyleForPanelByElement', panelEl, styleName, styleValue)
    })
  }

  private replaceClassForPanelById(panelId: string, oldClass: string, newClass: string) {
    const panelDiv = this._componentElementService.getComponentElementById(panelId)
    if (!panelDiv) {
      console.error(`No panel found for id ${panelId}`)
      // this._logger.warn(`No panel found for id ${panelId}`)
      return
    }
    if (panelDiv.classList.contains(newClass)) return
    this._renderer.removeClass(panelDiv, oldClass)
    this._renderer.addClass(panelDiv, newClass)
  }

  private replaceClassForPanelByElement(panelEl: Element, oldClass: string, newClass: string) {
    if (panelEl.classList.contains(newClass)) return
    this._renderer.removeClass(panelEl, oldClass)
    this._renderer.addClass(panelEl, newClass)
  }

}