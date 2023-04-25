export class StartViewDragging {
	readonly type = 'StartViewDragging'
	readonly payload = null
}

export class StopViewDragging {
	readonly type = 'StopViewDragging'
	readonly payload = null
}

export type XStateViewEvent = StartViewDragging | StopViewDragging
