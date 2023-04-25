export class StartSingleMove {
	readonly type = 'StartSingleMove'
	readonly payload = null
}

/*export class MoveSingleEntity {
 readonly type = 'MoveSingleEntity'

 constructor(
 public readonly payload: {
 id: string
 location: Point
 angle: AngleRadians
 },
 ) {}
 }*/

export class StopSingleMove {
	readonly type = 'StopSingleMove'
	readonly payload = null
}

/*export class CancelSingleMove {
 readonly type = 'CancelSingleMove'
 readonly payload = null
 }*/

export class StartMultipleMove {
	readonly type = 'StartMultipleMove'
	readonly payload = null
}

/*export class UpdateMultipleMove {
 readonly type = 'UpdateMultipleMove'

 constructor(
 public readonly payload: {
 offset: Point
 entities: AdjustedMultipleToMoveEntity[]
 },
 ) {}
 }

 export class MoveMultipleEntities {
 readonly type = 'MoveMultipleEntities'
 readonly payload = null
 }*/

export class StopMultipleMove {
	readonly type = 'StopMultipleMove'
	readonly payload = null
}

/*export class CancelMultipleMove {
 readonly type = 'CancelMultipleMove'
 readonly payload = null
 }*/

export type XStateToMoveEvent =
	| StartSingleMove
	| StopSingleMove
	// | MoveSingleEntity
	// | CancelSingleMove
	| StartMultipleMove
	// | UpdateMultipleMove
	// | MoveMultipleEntities
	| StopMultipleMove
// | CancelMultipleMove
