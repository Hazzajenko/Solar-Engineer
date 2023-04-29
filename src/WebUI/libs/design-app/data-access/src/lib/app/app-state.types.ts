import { DragBoxStateContext, DragBoxStateEvent } from '../drag-box'
import { GridStateEvent } from '../grid'
import { ToMoveStateContext, ToMoveStateEvent } from '../object-positioning'
import { ToRotateStateContext, ToRotateStateEvent } from '../object-rotating'
import { PointerStateContext, PointerStateEvent } from '../pointer'
import { ViewStateContext, ViewStateEvent } from '../view'
import { Typegen0 } from './app-state.machine.typegen'


export type AppStateMachineContext = {
	dragBox: DragBoxStateContext
	pointer: PointerStateContext
	toMove: ToMoveStateContext
	toRotate: ToRotateStateContext
	view: ViewStateContext
}

export type AppStateEvent =
	| DragBoxStateEvent
	| PointerStateEvent
	| ToMoveStateEvent
	| ToRotateStateEvent
	| ViewStateEvent
	| GridStateEvent

export type AppStateMatches = Typegen0['matchesStates']

export type AppStateMatchesModel = {
	DragBoxState?: 'CreationBoxInProgress' | 'NoDragBox' | 'SelectionBoxInProgress'
	GridState?:
		| 'ModeState'
		| 'PreviewAxisState'
		| {
				ModeState?: 'CreateMode' | 'SelectMode'
				PreviewAxisState?:
					| 'AxisCreatePreviewInProgress'
					| 'AxisRepositionPreviewInProgress'
					| 'None'
		  }
	PointerState?: 'HoveringOverEntity' | 'PointerIsDown' | 'PointerUp'
	SelectedState?: 'EntitySelected' | 'MultipleEntitiesSelected' | 'NoneSelected' | 'StringSelected'
	ToMoveState?: 'MultipleMoveInProgress' | 'NoMove' | 'SingleMoveInProgress'
	ToRotateState?:
		| 'MultipleRotateInProgress'
		| 'NoRotate'
		| 'SingleRotateInProgress'
		| 'SingleRotateModeInProgress'
	ViewState?:
		| 'ContextMenuState'
		| 'ViewPositioningState'
		| {
				ContextMenuState?: 'ContextMenuOpen' | 'NoContextMenu'
				ViewPositioningState?: 'ViewDraggingInProgress' | 'ViewNotMoving'
		  }
}