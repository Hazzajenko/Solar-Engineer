import { Axis } from '../../types'
import { EntityBounds } from '../../utils'

export type NearbyEntity = {
	id: string
	axis: Axis
	bounds: EntityBounds
	distance: number
}