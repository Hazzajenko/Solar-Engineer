import { inject, Injectable, RendererFactory2 } from '@angular/core'
import { MousePositionService } from './mouse-position.service'
import { XyLocation } from '@shared/data-access/models'
import { ComponentElementsService } from './component-elements.service'
import { ObjectPositioningService } from './object-positioning.service'
import { SelectedService } from '@no-grid-layout/data-access'

@Injectable({
  providedIn: 'root',
})
export class MultiSelectService {
  private _mousePositionService = inject(MousePositionService)
  private _componentElementsService = inject(ComponentElementsService)
  private _renderer = inject(RendererFactory2)
    .createRenderer(null, null)
  private _objectPositioningService = inject(ObjectPositioningService)
  private _selectedService = inject(SelectedService)

  private _multiSelectStartPoint: XyLocation | undefined
  private _multiSelectEndPoint: XyLocation | undefined

  get multiSelectStartPoint(): XyLocation | undefined {
    return this._multiSelectStartPoint
  }

  set multiSelectStartPoint(value: XyLocation | undefined) {
    this._multiSelectStartPoint = value
    console.log('set multiSelectStartPoint', value)
  }

  startMultiSelectionBox(location: XyLocation) {
    // this._mousePositionService.isAltKeyDragging = true
    // this._mousePositionService.isDragging = false
    this.multiSelectStartPoint = location
    console.log('startAltKeyDragging', location)

  }

  stopMultiSelectionBox(location: XyLocation) {
    if (!this.multiSelectStartPoint) return
    const elementsInArea = this._objectPositioningService.getAllElementsBetweenTwoPoints(this.multiSelectStartPoint, location)
    // console.log('elementsInArea', elementsInArea)
    this.multiSelectStartPoint = undefined
    this._selectedService.multiSelected = elementsInArea

    // console.log('stopAltKeyDragging')
  }
}