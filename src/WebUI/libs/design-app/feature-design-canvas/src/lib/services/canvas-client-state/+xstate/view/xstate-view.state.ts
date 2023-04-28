import { ENTITY_TYPE, EntityType } from '@design-app/shared'

export type ContextMenuState = {
	open: boolean
	x: number
	y: number
	id: string
	type: EntityType
}

export const InitialContextMenuState: ContextMenuState = {
	open: false,
	x: 0,
	y: 0,
	id: '',
	type: ENTITY_TYPE.Panel,
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