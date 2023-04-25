import { Axis } from '../../../types'
import { EntityBounds } from '../../../utils'
import { EntityStateStr } from './canvas-client-state'

export type NearbyStateDeprecated = EntityStateStr<NearbyEntityDeprecated>

export type NearbyEntityDeprecated = {
	id: string
	axis: Axis
	bounds: EntityBounds
	distance: number
}

export const InitialNearbyStateDeprecated: NearbyStateDeprecated = {
	ids: [],
	entities: {},
}