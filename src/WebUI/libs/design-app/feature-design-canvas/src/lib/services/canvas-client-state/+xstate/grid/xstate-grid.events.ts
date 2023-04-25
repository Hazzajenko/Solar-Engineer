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

export type TogglePreviewAxisDraw = {
	type: 'TogglePreviewAxisDraw'
}

export type XStateGridEvent =
	| StartClickSelectMode
	| StartClickCreateMode
	| ResetGridClickMode
	| TogglePreviewAxisDraw
