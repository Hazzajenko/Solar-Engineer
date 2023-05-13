import { Axis } from './axis'
import { EntityBounds } from './bounds'

export type NearbyEntity = {
	id: string
	axis: Axis
	bounds: EntityBounds
	distance: number
}