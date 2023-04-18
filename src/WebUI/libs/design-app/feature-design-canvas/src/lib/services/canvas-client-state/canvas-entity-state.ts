import { CanvasEntity } from '@design-app/feature-design-canvas'
import { UpdateStr } from '@ngrx/entity/src/models'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class CanvasEntityState {
  // private _render = inject(CanvasRenderService)
  // constructor(public readonly canvasRenderService: CanvasRenderService) {}

  ids: string[] = []
  entities: {
    [id: string]: CanvasEntity
  } = {}

  addEntity(entity: CanvasEntity) {
    if (this.entities[entity.id] || this.ids.includes(entity.id)) {
      return
    }
    this.ids.push(entity.id)
    this.entities[entity.id] = entity
  }

  addManyEntities(entities: CanvasEntity[]) {
    entities.forEach((entity) => this.addEntity(entity))
  }

  removeEntity(entityId: string) {
    delete this.entities[entityId]
    this.ids = this.ids.filter((id) => id !== entityId)
  }

  removeManyEntities(entityIds: string[]) {
    this.ids = this.ids.filter((id) => !entityIds.includes(id))
    const didMutate =
            entityIds
              .filter((key: string) => key in this.entities)
              .map((key: string) => delete this.entities[key]).length > 0

    if (didMutate) {
      this.ids = this.ids.filter((id: string) => id in this.entities)
    }
  }

  updateEntity(id: string, changes: Partial<CanvasEntity>) {
    this.entities[id] = {
      ...this.entities[id],
      ...changes,
    }
  }

  updateManyEntities(updates: UpdateStr<CanvasEntity>[]) {
    updates.forEach((update) => this.updateEntity(update.id, update.changes))
  }

  getEntity(id: string) {
    return this.entities[id]
  }

  getEntities() {
    return this.ids.map((id) => this.entities[id])
  }

  getEntityIds() {
    return this.ids
  }

  /*  private render() {
   return this._render.drawCanvas()
   }*/
}