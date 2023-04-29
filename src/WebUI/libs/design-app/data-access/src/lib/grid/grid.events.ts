export class StartClickSelectMode {
	readonly type = 'StartClickSelectMode'
	readonly payload = null
}

export class StartClickCreateMode {
	readonly type = 'StartClickCreateMode'
	readonly payload = null
}

export class ResetGridClickMode {
	readonly type = 'ResetGridClickMode'
	readonly payload = null
}

export type StartAxisRepositionPreview = {
	type: 'StartAxisRepositionPreview'
}

export type StartAxisCreatePreview = {
	type: 'StartAxisCreatePreview'
}

export type StopAxisPreview = {
	type: 'StopAxisPreview'
}

export type ToggleClickMode = {
	type: 'ToggleClickMode'
}

export type GridStateEvent =
	| StartClickSelectMode
	| StartClickCreateMode
	| ResetGridClickMode
	| StartAxisRepositionPreview
	| StartAxisCreatePreview
	| StopAxisPreview
	| ToggleClickMode
