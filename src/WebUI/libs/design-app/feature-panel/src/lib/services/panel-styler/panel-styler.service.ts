import { inject, Injectable, NgZone, RendererFactory2 } from '@angular/core'
import { DesignRectModel, LineDirection } from '@no-grid-layout/shared'

import { assertNotNull } from '@shared/utils'
import { PanelStylerFields } from './panel-styler.fields'
import { PanelBackgroundColor, PanelStyleState } from '../../types'
import { StyleName } from '@shared/data-access/models'
import { ComponentElementsService } from '@no-grid-layout/utils'

@Injectable({
  providedIn: 'root',
})
export class PanelStylerService
  extends PanelStylerFields {
  private _renderer = inject(RendererFactory2)
    .createRenderer(null, null)
  private _componentElementService = inject(ComponentElementsService)
  private _ngZone = inject(NgZone)

  public addNearbyPanel(designRectModel: DesignRectModel, direction: LineDirection) {
    // this.lightUpClosestPanel(designRectModel, direction)
    const panelElement = this._componentElementService.getComponentElementById(designRectModel.id)
    assertNotNull(panelElement, `No panel element found for id ${designRectModel.id}`)

    const nearbyPanel = {
      id: designRectModel.id,
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
    // this.setStyleForPanelById(designRectModel.id, 'background-color', PanelColorConfig.Purple)
    /*    this.nearbyPanels.push({
     id:      designRectModel.id,
     element: panelElement,
     direction,
     })*/
  }

  public removeFromNearbyPanelsByDirection(direction: LineDirection) {
    this.panelStyleStates = this.panelStyleStates.map((p) => {
      if (p.direction === direction) {
        p.direction = undefined
        if (p.backgroundColor === PanelBackgroundColor.Nearby) {
          p.backgroundColor = PanelBackgroundColor.Default
          this.setBackgroundColorForPanelById(p.id, PanelBackgroundColor.Default)
        }
      }
      return p
    })
  }

  setStyleForPanelById(panelId: string, styleName: StyleName, styleValue: string) {
    const panelDiv = this._componentElementService.getComponentElementById(panelId)
    assertNotNull(panelDiv, `No panel found for id ${panelId}`)
    this._ngZone.runOutsideAngular(() => {
        this._renderer.setStyle(panelDiv, styleName, styleValue)
      },
    )
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
  }

  private setStyleForPanelByElement(panelEl: Element, styleName: string, styleValue: string) {
    this._ngZone.runOutsideAngular(() => {
      this._renderer.setStyle(panelEl, styleName, styleValue)
    })
  }

  private replaceClassForPanelById(panelId: string, oldClass: string, newClass: string) {
    const panelDiv = this._componentElementService.getComponentElementById(panelId)
    if (!panelDiv) {
      console.error(`No panel found for id ${panelId}`)
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