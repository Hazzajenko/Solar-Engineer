import {
	DragBoxStateDeprecated,
	GridStateDeprecated,
	HoveringEntityState,
	InitialSelectedState,
	MenuState,
	ModeStateDeprecated,
	MouseState,
	NearbyStateDeprecated,
	SelectedStateDeprecated,
	ToMoveStateDeprecated,
	ToRotateStateDeprecated,
	ViewStateDeprecated,
} from '../types'
import { AdjustedDragBoxState, InitialAdjustedDragBoxState } from './drag-box'
import { AdjustedPointerState, InitialAdjustedPointerState } from './pointer'
import { AdjustedToMoveState, InitialAdjustedToMoveState } from './to-move'
import { AdjustedToRotateState, InitialAdjustedToRotateState } from './to-rotate'
import { InitialViewContext, ViewContext } from './view'
import { XStateEvent } from './xstate-app-events.types'
// import { ActionByType } from './selected/machine-actions.types'
import { inspect } from '@xstate/inspect'
import { createMachine } from 'xstate'


export type CanvasAppMachineContext = {
	hover: HoveringEntityState
	selected: SelectedStateDeprecated
	toRotate: ToRotateStateDeprecated
	toMove: ToMoveStateDeprecated
	dragBox: DragBoxStateDeprecated
	mode: ModeStateDeprecated
	view: ViewStateDeprecated
	mouse: MouseState
	menu: MenuState
	nearby: NearbyStateDeprecated
	grid: GridStateDeprecated
}

/*
 export const CURRENT_DRAG_BOX = {
 SELECTION: 'selection',
 CREATION: 'creation',
 AXIS_LINE: 'axis-line',
 } as const

 export type CurrentDragBox = (typeof CURRENT_DRAG_BOX)[keyof typeof CURRENT_DRAG_BOX]

 export type AdjustedDragBoxState = {
 currentDragBox: CurrentDragBox
 selectionBoxStart: TransformedPoint | undefined
 creationBoxStart: TransformedPoint | undefined
 axisLineBoxStart: TransformedPoint | undefined
 }

 export const InitialAdjustedDragBoxState: AdjustedDragBoxState = {
 currentDragBox: CURRENT_DRAG_BOX.SELECTION,
 selectionBoxStart: undefined,
 creationBoxStart: undefined,
 axisLineBoxStart: undefined,
 }
 */

export type PickedCanvasAppMachineContext = Pick<CanvasAppMachineContext, 'selected'> & {
	dragBox: AdjustedDragBoxState
	pointer: AdjustedPointerState
	toMove: AdjustedToMoveState
	toRotate: AdjustedToRotateState
	view: ViewContext
}

inspect({
	iframe: false,
	url: 'https://statecharts.io/inspect',
})
export const canvasAppMachine = createMachine(
	{
		/** @xstate-layout N4IgpgJg5mDOIC5QGECGA7Abq2BBADvgHQDKYANmAMYAukABCTanQMRrpUWMXV0QBtAAwBdRKHwB7WAEsaMyenEgAHogDsAJgA0IAJ6IAzAE4hRACybjANgAc6gKwBfJ7o7Y8hUr1oMmLMCIAUXR5Gj0eSl8IdnIZKgBreiDyWDAAdwALMAAnMGExJBApWXlFZTUEEwciIWNDR10DBE1zayJjB0MARk1nVxB3HAJiMij+RmY6YNC5CLG+SFj4hIYAeXR6ABEZADNd3LBQ5NnwguUSuQUlIsru83MiRv1EbutuonvDTSs363--sYXG4MB4Rt5xn4poEAHKKMCRRYxZBxRL0DYnMJ6c5FS5lG6gSrVWr1Z7NboObrAwag4ZeBbRSYBIhw9AIhn8Vj+HI0RG0a70ABCkhUOIk0iu5VuGgcZks3XsDiaiD66iIXWs5gctkMur1DWpQ08ox8E380w5DGFKiZPPoAAVJDJjmQaFzTQwALIAV3I8nwlExVzgYuKEvxFVerXalIc1j6ypalI6XV6-RBWDpJshECZFo9uettt5judvNd7vGAqLHC45EoglEF3D10jCEccs0CrJr3e6p1+sHhnMhtpxohSLzgR9fpkAYRITCMjgfM5uAgucXc3oABVJPQZ-7A5bG4VxaVW9KEPdTBYu4rEwqPuZ1NY430XAN0JIIHBlEaRmbC8pUJRAAFpWkTCCRwGAD6QLKcgMlAlVBVcxE2sQx1VHTNxxPKcZixVdICQiMr27DorDsHsWnjElMIccw-gBdQcLBeCcwI1l2QLUjL1AhBtRqBolReFotCIax1BsRU2KzCdGXNQJ8KLbkSydF0wBoPiQNQhBjFsWx1XUWw00TTRHE+aTqPTGlcPBfClKIQ850DLd5BXE8dJQu5KSw951G7UTmk0WxNDvGTHE-JwgA */
		tsTypes: {} as import('./client.machine.typegen').Typegen0,
		type: 'parallel',
		schema: {
			context: {} as PickedCanvasAppMachineContext,
			events: {} as XStateEvent,
		},
		id: 'CanvasApp',
		context: {
			selected: InitialSelectedState,
			dragBox: InitialAdjustedDragBoxState,
			pointer: InitialAdjustedPointerState,
			toMove: InitialAdjustedToMoveState,
			toRotate: InitialAdjustedToRotateState,
			view: InitialViewContext,
		},
		states: {
			SelectedState: {
				initial: 'NoneSelected',
				states: {
					EntitySelected: {
						on: {
							ClearEntitySelected: {
								target: 'NoneSelected',
								actions: 'ClearSelected',
							},
							SelectedDifferentEntity: {
								actions: 'SetSelectedEntity',
							},
						},
					},
					NoneSelected: {
						on: {
							SelectedSingleEntity: {
								target: 'EntitySelected',
								actions: 'SetSelectedEntity',
							},
							SelectionBoxCompleted: {
								target: 'MultipleEntitiesSelected',
							},
						},
					},
					MultipleEntitiesSelected: {
						on: {
							AddEntitiesToMultipleSelected: {
								actions: 'AddEntitiesToMultipleSelected',
								target: 'MultipleEntitiesSelected',
							},
							RemoveEntitiesFromMultipleSelected: {
								actions: 'RemoveEntitiesFromMultipleSelected',
								target: 'MultipleEntitiesSelected',
							},
						},
					},
				},
				on: {
					CancelSelected: {
						target: '.NoneSelected',
						cond: 'SelectedIsDefined',
						actions: 'ClearSelected',
					},
				},
			},
			DragBoxState: {
				initial: 'NoDragBox',
				states: {
					NoDragBox: {
						on: {
							SelectionBoxStarted: {
								target: 'SelectionBoxInProgress',
								actions: 'SetSelectionBoxStart',
							},
							CreationBoxStarted: {
								target: 'CreationBoxInProgress',
							},
						},
					},
					SelectionBoxInProgress: {
						on: {
							SelectionBoxCompleted: {
								target: 'NoDragBox',
								actions: ['SetMultipleSelectedEntities', 'ClearSelectionBoxStart'],
							},
							SelectionBoxCancelled: {
								target: 'NoDragBox',
								actions: 'ClearSelectionBoxStart',
							},
							StopDragBox: {
								target: 'NoDragBox',
								actions: 'ClearDragBox',
							},
						},
					},
					CreationBoxInProgress: {
						on: {
							CreationBoxCompleted: {
								target: 'NoDragBox',
							},
							CreationBoxCancelled: {
								target: 'NoDragBox',
							},
							StopDragBox: {
								target: 'NoDragBox',
							},
						},
					} /*					DragBoxInProgress: {
				 on: {
				 SelectionBoxCompleted: {
				 target: 'NoDragBox',
				 actions: ['SetMultipleSelectedEntities', 'ClearSelectionBoxStart'],
				 },
				 SelectionBoxCancelled: {
				 target: 'NoDragBox',
				 actions: 'ClearSelectionBoxStart',
				 },
				 StopDragBox: {
				 target: 'NoDragBox',
				 actions: 'ClearDragBox',
				 },
				 },
				 },*/,
				},
			},
			PointerState: {
				initial: 'PointerUp',
				states: {
					PointerUp: {
						on: {
							PointerDown: {
								target: 'PointerIsDown',
								actions: 'SetPointerDown',
							},
							PointerHoverOverEntity: {
								target: 'HoveringOverEntity',
								actions: 'SetHoveredEntity',
							},
						},
					},
					PointerIsDown: {
						on: {
							PointerUp: {
								target: 'PointerUp',
								actions: 'SetPointerUp',
							},
						},
					},
					HoveringOverEntity: {
						on: {
							PointerLeaveEntity: {
								target: 'PointerUp',
								actions: 'ClearHoveredEntity',
							},
						},
					},
				},
			},
			ToMoveState: {
				initial: 'NoMove',
				states: {
					NoMove: {
						on: {
							StartSingleMove: {
								target: 'SingleMoveInProgress',
								actions: 'SetSingleMove',
							},
							StartMultipleMove: {
								target: 'MultipleMoveInProgress',
								actions: 'SetMultipleMove',
							},
						},
					},
					SingleMoveInProgress: {
						on: {
							StopSingleMove: {
								target: 'NoMove',
								actions: 'StopSingleMove',
							},
						},
					},
					MultipleMoveInProgress: {
						on: {
							StopMultipleMove: {
								target: 'NoMove',
								actions: 'StopMultipleMove',
							},
						},
					},
				},
			},
			ToRotateState: {
				initial: 'NoRotate',
				states: {
					NoRotate: {
						on: {
							StartSingleRotate: {
								target: 'SingleRotateInProgress',
								actions: 'SetSingleRotate',
							},
							StartSingleRotateMode: {
								target: 'SingleRotateModeInProgress',
								actions: 'SetSingleRotateMode',
							},
							StartMultipleRotate: {
								target: 'MultipleRotateInProgress',
								actions: 'SetMultipleRotate',
							},
						},
					},
					SingleRotateInProgress: {
						on: {
							StopSingleRotate: {
								target: 'NoRotate',
								actions: 'StopSingleRotate',
							},
						},
					},
					SingleRotateModeInProgress: {
						on: {
							StopSingleRotateMode: {
								target: 'NoRotate',
								actions: 'StopSingleRotateMode',
							},
							StopSingleRotate: {
								target: 'NoRotate',
								actions: 'StopSingleRotateMode',
							},
						},
					},
					MultipleRotateInProgress: {
						on: {
							StopMultipleRotate: {
								target: 'NoRotate',
								actions: 'StopMultipleRotate',
							},
						},
					},
				},
			},
			ViewState: {
				initial: 'ViewNotMoving',
				states: {
					ViewNotMoving: {
						on: {
							StartViewDragging: {
								target: 'ViewDraggingInProgress',
								actions: 'SetViewDragging',
							},
						},
					},
					ViewDraggingInProgress: {
						on: {
							StopViewDragging: {
								target: 'ViewNotMoving',
								actions: 'StopViewDragging',
							},
						},
					},
				},
			},
			GridState: {
				type: 'parallel',
				states: {
					PreviewAxisState: {
						initial: 'PreviewAxisDrawDisabled',
						states: {
							PreviewAxisDrawEnabled: {
								on: {
									TogglePreviewAxisDraw: {
										target: 'PreviewAxisDrawDisabled',
									},
								},
							},
							PreviewAxisDrawDisabled: {
								on: {
									TogglePreviewAxisDraw: {
										target: 'PreviewAxisDrawEnabled',
									},
								},
							},
						},
					},
					ModeState: {
						initial: 'SelectMode',
						states: {
							SelectMode: {
								on: {
									StartClickCreateMode: {
										target: 'CreateMode',
									},
								},
							},
							CreateMode: {
								on: {
									StartClickSelectMode: {
										target: 'SelectMode',
									},
									ResetGridClickMode: {
										target: 'SelectMode',
									},
								},
							},
						},
					},
				},
			},
		},
		predictableActionArguments: true,
		preserveActionOrder: true,
	},
	{
		actions: {
			/**
			 * Selected State Actions
			 */
			ClearSelected: (ctx) => {
				return (ctx.selected = InitialSelectedState)
			},
			SetSelectedEntity: (ctx, event) => {
				return (ctx.selected = {
					...ctx.selected,
					singleSelectedId: event.payload.id,
					multipleSelectedIds: [],
					selectedStringId: undefined,
				})
			},
			SetMultipleSelectedEntities: (ctx, event) => {
				const ids = event.payload.ids
				if (ctx.selected.singleSelectedId) {
					return (ctx.selected = {
						...ctx.selected,
						multipleSelectedIds: [ctx.selected.singleSelectedId, ...ids],
						singleSelectedId: undefined,
					})
				}
				return (ctx.selected = {
					...ctx.selected,
					multipleSelectedIds: ids,
					singleSelectedId: undefined,
				})
			},
			AddEntitiesToMultipleSelected: (ctx, event) => {
				return (ctx.selected = {
					...ctx.selected,
					multipleSelectedIds: [...ctx.selected.multipleSelectedIds, ...event.payload.ids],
				})
			},
			RemoveEntitiesFromMultipleSelected: (ctx, { payload }) => {
				return (ctx.selected = {
					...ctx.selected,
					multipleSelectedIds: ctx.selected.multipleSelectedIds.filter(
						(id) => !payload.ids.includes(id),
					),
				})
			},

			/**
			 * Drag Box State Actions
			 */
			SetSelectionBoxStart: (ctx, event) => {
				return (ctx.dragBox = {
					...ctx.dragBox,
					selectionBoxStart: event.payload.point,
				})
			},
			ClearSelectionBoxStart: (ctx) => {
				return (ctx.dragBox = {
					...ctx.dragBox,
					selectionBoxStart: undefined,
				})
			},
			ClearDragBox: (ctx) => {
				return (ctx.dragBox = {
					...ctx.dragBox,
					selectionBoxStart: undefined,
					creationBoxStart: undefined,
				})
			},

			/**
			 * Pointer State Actions
			 */
			SetPointerDown: (ctx, event) => {
				return (ctx.pointer = {
					...ctx.pointer,
					currentTransformedPoint: event.payload.point,
					pointerDown: true,
				})
			},
			SetPointerUp: (ctx, event) => {
				// event.payload.
				return (ctx.pointer = {
					...ctx.pointer,
					currentTransformedPoint: event.payload.point,
					pointerDown: false,
				})
			},
			SetHoveredEntity: (ctx, event) => {
				return (ctx.pointer = {
					...ctx.pointer,
					currentTransformedPoint: event.payload.point,
					hoveringEntityId: event.payload.id,
				})
			},
			ClearHoveredEntity: (ctx, event) => {
				return (ctx.pointer = {
					...ctx.pointer,
					currentTransformedPoint: event.payload.point,
					hoveringEntityId: undefined,
				})
			},

			/**
			 * To Move State Actions
			 */
			SetSingleMove: (ctx) => {
				return (ctx.toMove = {
					...ctx.toMove,
					multipleToMove: false,
					singleToMove: true,
				})
			},

			SetMultipleMove: (ctx) => {
				return (ctx.toMove = {
					...ctx.toMove,
					singleToMove: false,
					multipleToMove: true,
				})
			},

			StopSingleMove: (ctx) => {
				return (ctx.toMove = {
					...ctx.toMove,
					multipleToMove: false,
					singleToMove: false,
				})
			},

			StopMultipleMove: (ctx) => {
				return (ctx.toMove = {
					...ctx.toMove,
					multipleToMove: false,
					singleToMove: false,
				})
			},

			/**
			 * To Rotate State Actions
			 */
			SetSingleRotate: (ctx) => {
				return (ctx.toRotate = {
					...ctx.toRotate,
					multipleToRotate: false,
					singleToRotate: true,
				})
			},

			SetSingleRotateMode: (ctx) => {
				return (ctx.toRotate = {
					...ctx.toRotate,
					multipleToRotate: false,
					singleToRotate: true,
					singleRotateMode: true,
				})
			},

			StopSingleRotateMode: (ctx) => {
				return (ctx.toRotate = {
					...ctx.toRotate,
					multipleToRotate: false,
					singleToRotate: false,
					singleRotateMode: false,
				})
			},

			StopSingleRotate: (ctx) => {
				return (ctx.toRotate = {
					...ctx.toRotate,
					multipleToRotate: false,
					singleToRotate: false,
				})
			},

			SetMultipleRotate: (ctx) => {
				return (ctx.toRotate = {
					...ctx.toRotate,
					singleToRotate: false,
					multipleToRotate: true,
				})
			},

			StopMultipleRotate: (ctx) => {
				return (ctx.toRotate = {
					...ctx.toRotate,
					multipleToRotate: false,
					singleToRotate: false,
				})
			},

			/**
			 * View State Actions
			 */
			SetViewDragging: (ctx) => {
				return (ctx.view = {
					...ctx.view,
					draggingScreen: true,
				})
			},

			StopViewDragging: (ctx) => {
				return (ctx.view = {
					...ctx.view,
					draggingScreen: false,
				})
			},
		},
		guards: {
			SelectedIsDefined: (ctx) => {
				return !!ctx.selected.singleSelectedId || ctx.selected.multipleSelectedIds.length > 0
			},
		},
	},
)