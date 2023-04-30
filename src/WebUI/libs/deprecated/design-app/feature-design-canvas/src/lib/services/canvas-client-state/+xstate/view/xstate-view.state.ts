export const CONTEXT_MENU_TYPE = {
	SINGLE_ENTITY: 'SingleEntity',
	MULTIPLE_ENTITIES: 'MultipleEntities',
} as const
export type ContextMenuType = (typeof CONTEXT_MENU_TYPE)[keyof typeof CONTEXT_MENU_TYPE]
export type ContextMenuState = {
	open: boolean
	x: number
	y: number
	id: string
	type: ContextMenuType
}

export type ViewContext = {
	draggingScreen: boolean
	contextMenu: ContextMenuState | undefined
}

export const InitialViewContext: ViewContext = {
	draggingScreen: false,
	contextMenu: undefined,
}
export const VIEW_STATE_KEY = 'ViewState'

export const VIEW_STATE = {
	VIEW_NOT_MOVING: 'ViewNotMoving',
	VIEW_DRAGGING_IN_PROGRESS: 'ViewDraggingInProgress',
} as const

export type ViewPositioningState = (typeof VIEW_STATE)[keyof typeof VIEW_STATE]

export type ViewState = {
	ViewPositioningState: ViewPositioningState
	ContextMenuState: ContextMenuState
}

/*const asdsa: ViewState = {
 value: VIEW_STATE.VIEW_DRAGGING_IN_PROGRESS,
 }*/
// export type ViewState = (typeof VIEW_STATE)[keyof typeof VIEW_STATE]
