// import { CanvasEntity } from '@design-app/feature-design-canvas'
import { Injectable } from '@angular/core'
import { EntityStateTemplate } from './entity-state-template'
import { CanvasString } from '../../types'

@Injectable({
  providedIn: 'root',
})
export class CanvasStringsStore
  extends EntityStateTemplate<CanvasString> {

  public override addEntity(entity: CanvasString) {
    super.addEntity(entity)
    console.log('CanvasStringsStore.addEntity', entity)
  }
}