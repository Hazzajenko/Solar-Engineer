import { createEntityAdapter, Dictionary, EntityAdapter, EntityState } from '@ngrx/entity'
import { UpdateStr } from '@ngrx/entity/src/models'

export abstract class EntityStateTemplate<
  T extends {
    id: string
  },
> implements EntityState<T>
{
  protected adapter: EntityAdapter<T> = createEntityAdapter<T>({
    selectId: (entity) => entity.id,
  })

  ids: string[] = []
  entities: Dictionary<T> = {}

  private set state(state: { ids: string[]; entities: Dictionary<T> }) {
    this.ids = state.ids
    this.entities = state.entities
  }

  private get state(): {
    ids: string[]
    entities: Dictionary<T>
  } {
    return {
      ids: this.ids,
      entities: this.entities,
    }
  }

  addEntity(entity: T) {
    this.state = this.adapter.addOne(entity, this.state)
  }

  addManyEntities(entities: T[]) {
    this.state = this.adapter.addMany(entities, this.state)
  }

  removeEntity(entityId: string) {
    this.state = this.adapter.removeOne(entityId, this.state)
  }

  removeManyEntities(entityIds: string[]) {
    this.state = this.adapter.removeMany(entityIds, this.state)
  }

  updateEntity(id: string, changes: Partial<T>) {
    this.state = this.adapter.updateOne({ id, changes }, this.state)
  }

  updateManyEntities(updates: UpdateStr<T>[]) {
    this.state = this.adapter.updateMany(updates, this.state)
  }

  getEntity(id: string) {
    return this.entities[id]
  }

  getEntities() {
    return this.adapter.getSelectors().selectAll(this)
  }

  getEntityIds() {
    return this.ids
  }
}