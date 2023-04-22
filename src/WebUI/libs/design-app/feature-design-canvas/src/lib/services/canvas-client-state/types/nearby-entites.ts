import { Axis } from '../../../types'
import { EntityBounds } from '../../../utils'
import { EntityStateStr } from './canvas-client-state'

export type NearbyState = EntityStateStr<NearbyEntity>

export type NearbyEntity = {
  id: string
  axis: Axis
  bounds: EntityBounds
  distance: number
}

export const InitialNearbyState: NearbyState = {
  ids: [],
  entities: {},
}