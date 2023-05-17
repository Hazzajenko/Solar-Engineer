import { NearbyEntity } from '@shared/data-access/models'
import { sortBy } from 'lodash'
import { groupInto2dArray } from '@shared/utils'

export function getClosedEntityOnAxis(nearbyEntitiesOnAxis: NearbyEntity[]) {
	const nearbySortedByDistance = sortBy(nearbyEntitiesOnAxis, (entity) => Math.abs(entity.distance))
	const nearby2dArray = groupInto2dArray(nearbySortedByDistance, 'axis')
	const closestNearby2dArray = nearby2dArray.map((arr) => arr[0])
	return closestNearby2dArray[0]
}
