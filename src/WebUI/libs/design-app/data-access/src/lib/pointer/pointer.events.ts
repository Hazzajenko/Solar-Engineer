export type PointerHoverOverEntity = {
	type: 'PointerHoverOverEntity'
	payload: {
		id: string
	}
}

export type PointerLeaveEntity = {
	type: 'PointerLeaveEntity'
}

export type PointerDownOnEntity = {
	type: 'PointerDownOnEntity'
	payload: {
		id: string
	}
}

export type PointerUpOnEntity = {
	type: 'PointerUpOnEntity'
}

export type PointerStateEvent =
	| PointerHoverOverEntity
	| PointerLeaveEntity
	| PointerDownOnEntity
	| PointerUpOnEntity
