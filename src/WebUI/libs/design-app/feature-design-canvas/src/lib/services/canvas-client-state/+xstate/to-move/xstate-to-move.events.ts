import { TransformedPoint } from '../../../../types'
import { AngleRadians } from '../../../../utils'
import { AdjustedMultipleToMoveEntity } from '../../types'
import { Point } from '@shared/data-access/models'

export class StartSingleMove {
	readonly type = 'StartSingleMove'

	constructor(
		public readonly payload: {
			id: string
			startPoint: TransformedPoint
			angle: AngleRadians
		},
	) {}
}

export class MoveSingleEntity {
	readonly type = 'MoveSingleEntity'

	constructor(
		public readonly payload: {
			id: string
			location: Point
			angle: AngleRadians
		},
	) {}
}

export class StopSingleMove {
	readonly type = 'StopSingleMove'
	readonly payload = null
}

export class CancelSingleMove {
	readonly type = 'CancelSingleMove'
	readonly payload = null
}

export class StartMultipleMove {
	readonly type = 'StartMultipleMove'

	constructor(
		public readonly payload: {
			ids: string[]
			startPoint: Point
			offset: Point
			entities: AdjustedMultipleToMoveEntity[]
		},
	) {}
}

export class MoveMultipleEntities {
	readonly type = 'MoveMultipleEntities'
	readonly payload = null
}

export class CancelMultipleMove {
	readonly type = 'CancelMultipleMove'
	readonly payload = null
}

export type XStateToMoveEvent =
	| StartSingleMove
	| StopSingleMove
	| MoveSingleEntity
	| CancelSingleMove
	| StartMultipleMove
	| MoveMultipleEntities
	| CancelMultipleMove