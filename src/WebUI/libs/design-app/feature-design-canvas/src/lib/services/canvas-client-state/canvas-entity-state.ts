// import { CanvasEntity } from '@design-app/feature-design-canvas'
import { inject, Injectable } from '@angular/core'
import { Dictionary } from '@ngrx/entity'
import { CanvasEntity } from '../../types'
import { CanvasEntitiesStore } from './canvas-entities.store'
import { CanvasStringsStore } from './canvas-strings.store'

export type EntityDataState = {
  ids: string[]
  entities: Dictionary<CanvasEntity>
}

@Injectable({
  providedIn: 'root',
})
export class CanvasEntityState {
  canvasEntities = inject(CanvasEntitiesStore)
  canvasStrings = inject(CanvasStringsStore)
  // private _render = inject(CanvasRenderService)
  // constructor(public readonly canvasRenderService: CanvasRenderService) {}

  /* private adapter: EntityAdapter<CanvasEntity> = createEntityAdapter<CanvasEntity>(
   {
   selectId: (entity) => entity.id,
   },
   )

   ids: string[] = []
   /!*    entities: {
   [id: string]: CanvasEntity
   } = {}*!/
   entities: Dictionary<CanvasEntity> = {}

   // temp = new EntityStateTemplate<CanvasEntity>()

   private set state(state: EntityDataState) {
   this.ids = state.ids
   this.entities = state.entities
   }

   private get state(): EntityDataState {
   return {
   ids:      this.ids,
   entities: this.entities,
   }
   }

   addEntity(entity: CanvasEntity) {
   /!*    if (this.entities[entity.id] || this.ids.includes(entity.id)) {
   return
   }
   this.ids.push(entity.id)
   this.entities[entity.id] = entity*!/
   this.state = this.adapter.addOne(entity, this.state)
   console.log('addEntity', entity, this.entities, this.ids)
   // this.adapter.
   }

   addManyEntities(entities: CanvasEntity[]) {
   // entities.forEach((entity) => this.addEntity(entity))
   // this.adapter.addMany(entities, this)
   this.state = this.adapter.addMany(entities, this.state)
   }

   removeEntity(entityId: string) {
   this.state = this.adapter.removeOne(entityId, this.state)
   // this.adapter.removeOne(entityId, this)
   // this.adapter.removeOne(entityId, this)
   /!*    delete this.entities[entityId]
   this.ids = this.ids.filter((id) => id !== entityId)*!/
   }

   removeManyEntities(entityIds: string[]) {
   this.state = this.adapter.removeMany(entityIds, this.state)
   // this.adapter.removeMany(entityIds, this)
   // this.adapter.removeMany(entityIds, this)
   /!*    this.ids = this.ids.filter((id) => !entityIds.includes(id))
   const didMutate =
   entityIds
   .filter((key: string) => key in this.entities)
   .map((key: string) => delete this.entities[key]).length > 0

   if (didMutate) {
   this.ids = this.ids.filter((id: string) => id in this.entities)
   }*!/
   }

   updateEntity(id: string, changes: Partial<CanvasEntity>) {
   this.state = this.adapter.updateOne({ id, changes }, this.state)
   // this.adapter.updateOne({ id, changes }, this)
   /!*    this.entities[id] = {
   ...this.entities[id],
   ...changes,
   }*!/
   }

   updateManyEntities(updates: UpdateStr<CanvasEntity>[]) {
   this.state = this.adapter.updateMany(updates, this.state)
   // this.adapter.updateMany(updates, this)
   // updates.forEach((update) => this.updateEntity(update.id, update.changes))
   }

   getEntity(id: string) {
   return this.entities[id]
   }

   getEntities() {
   return this.adapter.getSelectors()
   .selectAll(this)
   // return this.ids.map((id) => this.entities[id])
   }

   getEntitiesByIds(ids: string[]) {
   return this.adapter.getSelectors()
   .selectAll(this)
   .filter((entity) => ids.includes(entity.id))
   }

   getDictionaryByIds(ids: string[]) {
   return mapToDictionary(this.getEntitiesByIds(ids))
   // .filter((entity) => ids.includes(entity.id))
   }

   getEntityIds() {
   return this.ids
   }

   /!*  private render() {
   return this._render.drawCanvas()
   }*!/*/
}