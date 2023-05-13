// import { CanvasEntity } from '@design-app/feature-design-canvas'
import { CanvasEntity } from '../../types'
import { EntityStateTemplate } from './entity-state-template'
import { Injectable } from '@angular/core'

@Injectable({
	providedIn: 'root',
})
export class CanvasEntitiesStore extends EntityStateTemplate<CanvasEntity> {
	/*  getEntitiesByIds(ids: string[]) {
    return this.getEntities()
      .filter((entity) => ids.includes(entity.id))
  }*/
}
