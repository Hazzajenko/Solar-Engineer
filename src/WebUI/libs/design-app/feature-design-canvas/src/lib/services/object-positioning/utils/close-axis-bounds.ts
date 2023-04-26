import { Axis, CanvasEntity } from '../../../types'
import { EntityBounds, getDistanceBetweenTwoPoints, getEntityBounds } from '../../../utils'
import { NearbyEntity } from '../../nearby'

export const findNearbyAxisBounds = (bounds: EntityBounds, entities: CanvasEntity[]) => {
	const { left, right, top, bottom } = bounds
	return entities.filter((entity) => {
		const {
			left: entityLeft,
			right: entityRight,
			top: entityTop,
			bottom: entityBottom,
		} = getEntityBounds(entity)
		return (
			(entityLeft >= left && entityLeft <= right) ||
			(entityRight >= left && entityRight <= right) ||
			(entityTop >= top && entityTop <= bottom) ||
			(entityBottom >= top && entityBottom <= bottom)
		)
	})
}

export const findNearbyBoundOverlapOnBothAxis = (
	bounds: EntityBounds,
	entities: CanvasEntity[],
): NearbyEntity[] => {
	const { left, right, top, bottom } = bounds
	const entitiesWithBounds = entities.map((entity) => {
		return {
			...entity,
			bounds: getEntityBounds(entity),
		}
	})
	return ['x', 'y']
		.map((axis) => {
			const nearbyEntities = entitiesWithBounds.filter((entity) => {
				const {
					left: entityLeft,
					right: entityRight,
					top: entityTop,
					bottom: entityBottom,
				} = entity.bounds
				return (
					(axis === 'x' &&
						((entityLeft >= left && entityLeft <= right) ||
							(entityRight >= left && entityRight <= right))) ||
					(axis === 'y' &&
						((entityTop >= top && entityTop <= bottom) ||
							(entityBottom >= top && entityBottom <= bottom)))
				)
			})
			return nearbyEntities.map((entity) => {
				const distance = getDistanceBetweenTwoPoints(
					{ x: entity.bounds.left, y: entity.bounds.top },
					{ x: left, y: top },
				)
				return {
					...entity,
					axis: axis as Axis,
					bounds: getEntityBounds(entity),
					distance,
				}
			})
		})
		.reduce((accumulator, value) => accumulator.concat(value), [])
}

export const findNearbyBoundOverlapOnBothAxisExcludingIds = (
	bounds: EntityBounds,
	entities: CanvasEntity[],
	excludedIds: string[],
): NearbyEntity[] => {
	const { left, right, top, bottom } = bounds
	const entitiesWithBounds = entities.map((entity) => {
		return {
			...entity,
			bounds: getEntityBounds(entity),
		}
	})
	return ['x', 'y']
		.map((axis) => {
			const nearbyEntities = entitiesWithBounds.filter((entity) => {
				const {
					left: entityLeft,
					right: entityRight,
					top: entityTop,
					bottom: entityBottom,
				} = entity.bounds
				return (
					(axis === 'x' &&
						((entityLeft >= left && entityLeft <= right) ||
							(entityRight >= left && entityRight <= right))) ||
					(axis === 'y' &&
						((entityTop >= top && entityTop <= bottom) ||
							(entityBottom >= top && entityBottom <= bottom)))
				)
			})
			return nearbyEntities
				.filter((entity) => !excludedIds.includes(entity.id))
				.map((entity) => {
					const distance = getDistanceBetweenTwoPoints(
						{ x: entity.bounds.left, y: entity.bounds.top },
						{ x: left, y: top },
					)
					return {
						...entity,
						axis: axis as Axis,
						bounds: getEntityBounds(entity),
						distance,
					}
				})
		})
		.reduce((accumulator, value) => accumulator.concat(value), [])
}

export const findNearbyAxisBoundsByAxis = (
	bounds: EntityBounds,
	entities: CanvasEntity[],
	axis: Axis,
) => {
	const { left, right, top, bottom } = bounds
	const nearbyEntities = entities.filter((entity) => {
		const {
			left: entityLeft,
			right: entityRight,
			top: entityTop,
			bottom: entityBottom,
		} = getEntityBounds(entity)
		return (
			(axis === 'x' &&
				((entityLeft >= left && entityLeft <= right) ||
					(entityRight >= left && entityRight <= right))) ||
			(axis === 'y' &&
				((entityTop >= top && entityTop <= bottom) ||
					(entityBottom >= top && entityBottom <= bottom)))
		)
	})
	return nearbyEntities.map((entity) => {
		// const { left: entityLeft, right: entityRight, top: entityTop, bottom: entityBottom } = getEntityBounds(entity)
		return {
			...entity,
			axis,
			bounds: getEntityBounds(entity),
		}
	})
	/*  const nearbyBounds = nearbyEntities.map((entity) => {
	 const { left: entityLeft, right: entityRight, top: entityTop, bottom: entityBottom } = getEntityBounds(entity)
	 return {
	 left: axis === 'x' ? entityLeft : left,
	 right: axis === 'x' ? entityRight : right,
	 top: axis === 'y' ? entityTop : top,
	 bottom: axis === 'y' ? entityBottom : bottom,
	 }
	 })*/
	// return nearbyBounds
}