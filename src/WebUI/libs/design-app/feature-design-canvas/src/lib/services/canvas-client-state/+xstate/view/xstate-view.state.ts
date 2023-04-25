export type ViewContext = {
	draggingScreen: boolean
}

export const InitialViewContext: ViewContext = {
	draggingScreen: false,
}
export const VIEW_STATE_KEY = 'ViewState'

export const VIEW_STATE = {
	VIEW_NOT_MOVING: 'ViewNotMoving',
	VIEW_DRAGGING_IN_PROGRESS: 'ViewDraggingInProgress',
} as const

export type ViewState = (typeof VIEW_STATE)[keyof typeof VIEW_STATE]
