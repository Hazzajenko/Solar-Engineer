export const CONTEXT_MENU_TYPE = {
	SINGLE_ENTITY: 'SingleEntity',
	MULTIPLE_ENTITIES: 'MultipleEntities',
	STRING: 'String',
} as const
export type ContextMenuType = (typeof CONTEXT_MENU_TYPE)[keyof typeof CONTEXT_MENU_TYPE]
type ContextMenuTemplate = {
	x: number
	y: number
}
export type SingleEntityContextMenuTemplate = ContextMenuTemplate & {
	id: string
	type: typeof CONTEXT_MENU_TYPE.SINGLE_ENTITY
}
export type MultipleEntitiesContextMenuTemplate = ContextMenuTemplate & {
	ids: string[]
	type: typeof CONTEXT_MENU_TYPE.MULTIPLE_ENTITIES
}
export type StringContextMenuTemplate = ContextMenuTemplate & {
	stringId: string
	panelIds: string[]
	type: typeof CONTEXT_MENU_TYPE.STRING
}
export type ContextMenuState =
	| SingleEntityContextMenuTemplate
	| MultipleEntitiesContextMenuTemplate
	| StringContextMenuTemplate

export const isSingleEntityContextMenuTemplate = (
	template: ContextMenuTemplate,
): template is SingleEntityContextMenuTemplate => {
	return 'id' in template
}

export const isMultipleEntitiesContextMenuTemplate = (
	template: ContextMenuTemplate,
): template is MultipleEntitiesContextMenuTemplate => {
	return 'ids' in template
}

export const isStringContextMenuTemplate = (
	template: ContextMenuTemplate,
): template is StringContextMenuTemplate => {
	return 'stringId' in template
}
/*export type ContextMenuState = {
 x: number
 y: number
 id: string
 type: ContextMenuType
 }*/

export type ViewStateContext = {
	draggingScreen: boolean
	contextMenu: ContextMenuState | undefined
}

export const InitialViewContext: ViewStateContext = {
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
