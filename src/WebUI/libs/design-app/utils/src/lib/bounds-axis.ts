import { getEntityBounds } from './bounds'
import {
	AXIS,
	Axis,
	CanvasEntity,
	CompleteEntityBounds,
	EntityBounds,
	NearbyEntity,
} from '@design-app/shared'
import { getDistanceBetweenTwoPoints } from 'deprecated/design-app/feature-design-canvas'

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

export const getCtxRectBoundsByAxisV2 = (
	bounds: EntityBounds,
	axis: Axis,
	mouseBoxBounds: EntityBounds,
): CompleteEntityBounds => {
	const { left, top } = bounds
	const width = bounds.right - bounds.left
	const height = bounds.bottom - bounds.top
	let x = 0
	let y = 0
	if (axis === AXIS.X) {
		x = left
		y = mouseBoxBounds.top
	}
	if (axis === AXIS.Y) {
		x = mouseBoxBounds.left
		y = top
	}
	// const w = width
	// const h = height
	return {
		left: x,
		top: y,
		right: x + width,
		bottom: y + height,
		centerX: x + width / 2,
		centerY: y + height / 2,
		width,
		height,
	}
}
