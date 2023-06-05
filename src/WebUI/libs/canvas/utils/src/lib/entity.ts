import { UpdateStr } from '@ngrx/entity/src/models'
import { AngleRadians, Point } from '@shared/data-access/models'
import { newGuid } from '@shared/utils'
import { EntityBase, EntityType, PanelModel, StringModel } from '@entities/shared'

export const EntityFactory = {
	create: (type: EntityType, location: Point): EntityBase => {
		// const { width, height } = getEntitySize(type)
		return {
			id: newGuid(),
			type,
			location,
			angle: 0 as AngleRadians,
		}
	},
	update: (entity: EntityBase, changes: Partial<EntityBase>): EntityBase => {
		return {
			...entity,
			...changes,
		}
	},
	updateForStore: (entity: EntityBase, changes: Partial<EntityBase>): UpdateStr<EntityBase> => {
		return {
			id: entity.id,
			changes,
		}
	},
} as const
/*
 type Predicate<T> = (value: T, index: number, array: T[]) => unknown
 type PredicateV2<T, U> = (value: T, index: number, array: T[]) => U
 // map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];


 export const updateObjectPredicate = <T>(entities: U[], predicate: Predicate<U>): T[] => {
 return entities.map((entity, index) => {
 if (predicate(entity, index, entities)) {
 return entity
 }
 return entity
 })
 }
 const updateObjectsWithPredicate = <T>(entities: T[], predicate: Predicate<T>, changes: Partial<T>): T[] => {
 return entities.map((entity, index) => {
 if (predicate(entity, index, entities)) {
 return {
 ...entity,
 ...changes,
 }
 }
 return entity
 })
 }*/

export const updateObjects = <T>(entities: T[], changes: Partial<T>): T[] => {
	return entities.map((entity) => {
		return {
			...entity,
			...changes,
		}
	})
}
/*
 const entities: CanvasEntity[] = []

 updateObjects(entities)*/

/*const multiSelectedUpdated = entities.map((entity) => {
 const location = entity.location
 const newLocation = {
 x: location.x + offset.x,
 y: location.y + offset.y,
 }
 return updateObjectById(entity, { location: newLocation })
 })*/

export const updateObjectById = <T extends PanelModel | StringModel>(
	entity: T,
	changes: Partial<T>,
): T => {
	return {
		...entity,
		...changes,
	}
}

export const updateObjectByIdForStoreV2 = <
	T extends {
		id: string
	},
>(
	id: T['id'],
	changes: Partial<T>,
): UpdateStr<T> => {
	return {
		id: id,
		changes,
	}
}
export const updateObjectByIdForStore = <T extends EntityBase | StringModel>(
	id: T['id'],
	changes: Partial<T>,
): UpdateStr<T> => {
	return {
		id: id,
		changes,
	}
}

export const updateObjectByIdForStoreV3 =
	<T extends EntityBase | StringModel>( // id: T['id'],
		changes: Partial<T>,
	) =>
	(entity: T): UpdateStr<T> => {
		return {
			id: entity.id,
			changes,
		}
	}
