import { UpdateStr } from '@ngrx/entity/src/models'
import {
	AngleRadians,
	CanvasEntity,
	EntityType,
	Point,
	SizeByType,
} from '@shared/data-access/models'
import { newGuid } from '@shared/utils'
import { CanvasPanel } from '@entities/panels/data-access'
import { CanvasString } from '@entities/strings/data-access'

export const EntityFactory = {
	create: (type: EntityType, location: Point): CanvasEntity => {
		const { width, height } = SizeByType[type]
		return {
			id: newGuid(),
			type,
			location,
			width,
			height,
			angle: 0 as AngleRadians,
		}
	},
	update: (entity: CanvasEntity, changes: Partial<CanvasEntity>): CanvasEntity => {
		return {
			...entity,
			...changes,
		}
	},
	updateForStore: (
		entity: CanvasEntity,
		changes: Partial<CanvasEntity>,
	): UpdateStr<CanvasEntity> => {
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

export const updateObjectById = <T extends CanvasPanel | CanvasString>(
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
export const updateObjectByIdForStore = <T extends CanvasEntity | CanvasString>(
	id: T['id'],
	changes: Partial<T>,
): UpdateStr<T> => {
	return {
		id: id,
		changes,
	}
}

export const updateObjectByIdForStoreV3 =
	<T extends CanvasEntity | CanvasString>( // id: T['id'],
		changes: Partial<T>,
	) =>
	(entity: T): UpdateStr<T> => {
		return {
			id: entity.id,
			changes,
		}
	}
