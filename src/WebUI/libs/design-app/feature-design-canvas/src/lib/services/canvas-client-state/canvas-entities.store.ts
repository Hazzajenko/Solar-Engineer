// import { CanvasEntity } from '@design-app/feature-design-canvas'
import { Injectable } from '@angular/core'
import { EntityStateTemplate } from './entity-state-template'
import { CanvasEntity } from '../../types'

@Injectable({
  providedIn: 'root',
})
export class CanvasEntitiesStore
  extends EntityStateTemplate<CanvasEntity> {

  getEntitiesByIds(ids: string[]) {
    return this.getEntities()
      .filter((entity) => ids.includes(entity.id))
  }
}