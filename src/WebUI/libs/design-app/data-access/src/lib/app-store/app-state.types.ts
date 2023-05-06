import { ContextMenuType } from '../view'

export const DRAG_BOX_STATE = {
	CREATION_BOX_IN_PROGRESS: 'CreationBoxInProgress',
	NO_DRAG_BOX: 'NoDragBox',
	SELECTION_BOX_IN_PROGRESS: 'SelectionBoxInProgress',
} as const

export type DragBoxState = (typeof DRAG_BOX_STATE)[keyof typeof DRAG_BOX_STATE]

export const MODE_STATE = {
	CREATE_MODE: 'CreateMode',
	SELECT_MODE: 'SelectMode',
} as const

export type ModeState = (typeof MODE_STATE)[keyof typeof MODE_STATE]

export const PREVIEW_AXIS_STATE = {
	AXIS_CREATE_PREVIEW_IN_PROGRESS: 'AxisCreatePreviewInProgress',
	AXIS_REPOSITION_PREVIEW_IN_PROGRESS: 'AxisRepositionPreviewInProgress',
	NONE: 'None',
} as const

export type PreviewAxisState = (typeof PREVIEW_AXIS_STATE)[keyof typeof PREVIEW_AXIS_STATE]

export type AxisPreviewState = {
	previewAxis: PreviewAxisState
}

export const HOVERING_OVER_ENTITY_STATE = {
	NO_HOVER: 'NoHover',
	HOVERING_OVER_ENTITY: 'HoveringOverEntity',
} as const

// export type PreviewState

export type HoveringOverEntityState =
	(typeof HOVERING_OVER_ENTITY_STATE)[keyof typeof HOVERING_OVER_ENTITY_STATE]

export type PointerState = {
	hoverState: HoveringOverEntityState
	hoveringOverEntityId: string | undefined
}

export const InitialPointerState: PointerState = {
	hoverState: HOVERING_OVER_ENTITY_STATE.NO_HOVER,
	hoveringOverEntityId: undefined,
}

/*
 export const SELECTED_STATE = {
 ENTITY_SELECTED: 'EntitySelected',
 MULTIPLE_ENTITIES_SELECTED: 'MultipleEntitiesSelected',
 NONE_SELECTED: 'NoneSelected',
 STRING_SELECTED: 'StringSelected',
 } as const

 export type SelectedState = (typeof SELECTED_STATE)[keyof typeof SELECTED_STATE]
 */

export const TO_MOVE_STATE = {
	MULTIPLE_MOVE_IN_PROGRESS: 'MultipleMoveInProgress',
	NO_MOVE: 'NoMove',
	SINGLE_MOVE_IN_PROGRESS: 'SingleMoveInProgress',
} as const

export type ToMoveState = (typeof TO_MOVE_STATE)[keyof typeof TO_MOVE_STATE]

export const TO_ROTATE_STATE = {
	MULTIPLE_ROTATE_IN_PROGRESS: 'MultipleRotateInProgress',
	NO_ROTATE: 'NoRotate',
	SINGLE_ROTATE_IN_PROGRESS: 'SingleRotateInProgress',
	SINGLE_ROTATE_MODE_IN_PROGRESS: 'SingleRotateModeInProgress',
} as const

export type ToRotateState = (typeof TO_ROTATE_STATE)[keyof typeof TO_ROTATE_STATE]

export const CONTEXT_MENU_OPEN_STATE = {
	CONTEXT_MENU_OPEN: 'ContextMenuOpen',
	NO_CONTEXT_MENU: 'NoContextMenu',
} as const

export type ContextMenuOpenState =
	(typeof CONTEXT_MENU_OPEN_STATE)[keyof typeof CONTEXT_MENU_OPEN_STATE]

export type ContextMenuState = {
	state: ContextMenuOpenState
	type: ContextMenuType | undefined
}

export const VIEW_POSITIONING_STATE = {
	VIEW_DRAGGING_IN_PROGRESS: 'ViewDraggingInProgress',
	VIEW_NOT_MOVING: 'ViewNotMoving',
} as const

export type ViewPositioningState =
	(typeof VIEW_POSITIONING_STATE)[keyof typeof VIEW_POSITIONING_STATE]

export type TypeOfAppState =
	| DragBoxState
	| ModeState
	| PreviewAxisState
	| HoveringOverEntityState
	// | SelectedState
	| ToMoveState
	| ToRotateState
	| ContextMenuOpenState
	| ViewPositioningState