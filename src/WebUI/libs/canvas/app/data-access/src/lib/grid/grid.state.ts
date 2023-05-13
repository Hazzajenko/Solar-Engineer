export const CLICK_MODE = {
	SELECT: 'Select',
	CREATE: 'Create',
} as const

export type ClickMode = (typeof CLICK_MODE)[keyof typeof CLICK_MODE]

export type GridStateContext = {
	clickMode: ClickMode
	inAxisPreview: boolean
}

export const InitialGridStateContext: GridStateContext = {
	clickMode: CLICK_MODE.SELECT,
	inAxisPreview: false,
}
export const GRID_STATE_KEY = 'GridState'

export const GRID_STATE_PROPER = {
	PREVIEW_AXIS_STATE: 'PreviewAxisState',
	MODE_STATE: 'ModeState',
} as const

/*export const PREVIEW_AXIS_STATE = {
	PREVIEW_AXIS_DRAW_ENABLED: 'PreviewAxisDrawEnabled',
	PREVIEW_AXIS_DRAW_DISABLED: 'PreviewAxisDrawDisabled',
} as const

export type PreviewAxisState = (typeof PREVIEW_AXIS_STATE)[keyof typeof PREVIEW_AXIS_STATE]*/

/*export const MODE_STATE = {
 SELECT_MODE: 'SelectMode',
 CREATE_MODE: 'CreateMode',
 } as const*/
/*export const MODE_STATE = {
	IN_SELECT_MODE: 'SelectMode',
	IN_CREATE_MODE: 'CreateMode',
} as const

export type ModeState = (typeof MODE_STATE)[keyof typeof MODE_STATE]*/
// SelectMode
// CreateMode
/*export const MODE_STATE = {
 NO_PREVIEW: 'NoPreview',
 PREVIEW_AXIS_DRAW: 'PreviewAxisDraw',
 } as const*/
// }

/*export const GRID_STATE = {
 PREVIEW_AXIS_STATE: PREVIEW_AXIS_STATE,
 MODE_STATE: MODE_STATE,
 } as const*/

/*export type GridState = {
	PreviewAxisState: PreviewAxisState
	ModeState: ModeState
}

export const GRID_STATE = {
	PreviewAxisState: PREVIEW_AXIS_STATE,
	ModeState: MODE_STATE,
} as const

export const InitialGridState: GridState = {
	PreviewAxisState: PREVIEW_AXIS_STATE.PREVIEW_AXIS_DRAW_ENABLED,
	ModeState: MODE_STATE.IN_SELECT_MODE,
}*/
// export type GridState = (typeof MODE_STATE)[keyof typeof MODE_STATE]

// PreviewAxisDrawEnabled
// PreviewAxisDrawDisabled
// PreviewAxisState
// ModeState
// NoPreview
// PreviewAxisDraw
