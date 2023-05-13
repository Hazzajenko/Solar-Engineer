import { EntityStateStr } from './types'
import { createEntityAdapter, Dictionary, EntityAdapter } from '@ngrx/entity'
import { UpdateStr } from '@ngrx/entity/src/models'

export class EntityStateFactory<
	T extends {
		id: string
	},
> implements EntityStateStr<T>
{
	private adapter: EntityAdapter<T> = createEntityAdapter<T>({
		selectId: (entity) => entity.id,
	})

	ids: string[] = []
	entities: Dictionary<T> = {}

	private selectors = this.adapter.getSelectors()

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

	getEntityById(id: string) {
		return this.entities[id]
	}

	getAll() {
		return this.selectors.selectAll(this.state)
	}

	getDictionary() {
		return this.entities
	}

	getEntityIds() {
		return this.ids
	}
}
