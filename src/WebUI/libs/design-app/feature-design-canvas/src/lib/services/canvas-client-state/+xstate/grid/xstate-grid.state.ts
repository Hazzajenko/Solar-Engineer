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
export const GRID_STATE = {
	IN_SELECT_MODE: 'SelectMode',
	IN_CREATE_MODE: 'CreateMode',
} as const

export type GridState = (typeof GRID_STATE)[keyof typeof GRID_STATE]
