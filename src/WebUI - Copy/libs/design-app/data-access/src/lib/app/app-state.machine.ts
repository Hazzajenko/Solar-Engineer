import { InitialDragBoxContext } from '../drag-box'
import { InitialToMoveContext } from '../object-positioning'
import { InitialToRotateContext } from '../object-rotating'
import { InitialPointerContext } from '../pointer'
import { InitialViewContext } from '../view'
import { AppStateEvent, AppStateMachineContext } from './app-state.types'
import { createMachine } from 'xstate'


export const appStateMachine = createMachine(
	{
		/** @xstate-layout N4IgpgJg5mDOIC5QGECGA7Abq2BBADvgHQDKYANmAMYAukABCTanQMRrpUWMXV0QBtAAwBdRKHwB7WAEsaMyenEgAHogDsAJgA0IAJ6IAzAE4hRACybjANgAc6gKwBfJ7o7Y8hUr1oMmLMCIAUXR5Gj0eSl8IdnIZKgBreiDyWDAAdwALMAAnMGExJBApWXlFZTUEEwciIWNDR10DBE1zayJjB0MARk1nVxB3HAJiMij+RmY6YNC5CLG+SFj4hIYAeXR6ABEZADNd3LBQ5NnwguUSuQUlIsru83MiRv1EbutuonvDTSs363--sYXG4MB4Rt5xn4poEAHKKMCRRYxZBxRL0DYnMJ6c5FS5lG6gSrVWr1Z7NboObrAwag4ZeBbRSYBIhw9AIhn8Vj+HI0RG0a70ABCkhUOIk0iu5VuGgcZks3XsDiaiD66iIXWs5gctkMur1DWpQ08ox8E380w5DGFKiZPPoAAVJDJjmQaFzTQwALIAV3I8nwlExVzgYuKEvxFVerXalIc1j6ypalI6XV6-RBWDpJshECZFo9uettt5judvNd7vGAqLHC45EoglEF3D10jCEccs0CrJr3e6p1+sHhnMhtpxohSLzgR9fpkAYRITCMjgfM5uAgucXc3oABVJPQZ-7A5bG4VxaVW9KEPdTBYu4rEwqPuZ1NY430XAN0JIIHBlEaRmbC8pUJRAAFpWkTCCRwGAD6QLKcgMlAlVBVcxE2sQx1VHTNxxPKcZixVdICQiMr27DorDsHsWnjElMIccw-gBdQcLBeCcwI1l2QLUjL1AhBtRqBolReFotCIax1BsRU2KzCdGXNQJ8KLbkSydF0wBoPiQNQhBjFsWx1XUWw00TTRHE+aTqPTGlcPBfClKIQ850DLd5BXE8dJQu5KSw951G7UTmk0WxNDvGTHE-JwgA */
		tsTypes: {} as import('./app-state.machine.typegen').Typegen0,
		type: 'parallel',
		schema: {
			context: {} as AppStateMachineContext,
			events: {} as AppStateEvent,
		},
		id: 'CanvasApp',
		context: {
			dragBox: InitialDragBoxContext,
			pointer: InitialPointerContext,
			toMove: InitialToMoveContext,
			toRotate: InitialToRotateContext,
			view: InitialViewContext,
		},
		states: {
			DragBoxState: {
				initial: 'NoDragBox',
				states: {
					NoDragBox: {
						on: {
							SelectionBoxStarted: {
								target: 'SelectionBoxInProgress', // actions: 'SetSelectionBoxStart',
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
					},
				},
			},
			PointerState: {
				initial: 'NoHover',
				states: {
					NoHover: {
						on: {
							PointerHoverOverEntity: {
								target: 'HoveringOverEntity',
								actions: 'SetHoveredEntity',
							},
						},
					},
					HoveringOverEntity: {
						on: {
							PointerLeaveEntity: {
								target: 'NoHover',
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
				// initial: 'ViewNotMoving',
				type: 'parallel',
				states: {
					ContextMenuState: {
						initial: 'NoContextMenu',
						states: {
							NoContextMenu: {
								on: {
									OpenContextMenu: {
										target: 'ContextMenuOpen', // actions: (ctx, event) => {
										// 	ctx.view.contextMenu = {
										// 		x: event.payload.x,
										// 		y: event.payload.y,
										// 		open: true,
										// 		type: event.payload.type,
										// 		id: event.payload.id,
										// 	}
										// },
									},
								},
							},
							ContextMenuOpen: {
								on: {
									OpenContextMenu: {
										target: 'ContextMenuOpen', // actions: ['']
										/*										actions: (ctx, event) => {
									 ctx.view.contextMenu = {
									 x: event.payload.x,
									 y: event.payload.y,
									 open: true,
									 type: event.payload.type,
									 id: event.payload.id,
									 }
									 },*/
									},
									CloseContextMenu: {
										target: 'NoContextMenu', // actions: (ctx) => {
										// 	ctx.view.contextMenu = undefined
										// },
									},
								},
							},
						},
					},
					ViewPositioningState: {
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
				},
			},
			GridState: {
				type: 'parallel',
				states: {
					PreviewAxisState: {
						initial: 'None',
						states: {
							None: {
								on: {
									StartAxisRepositionPreview: {
										target: 'AxisRepositionPreviewInProgress',
									},
									StartAxisCreatePreview: {
										target: 'AxisCreatePreviewInProgress',
									},
								},
							},
							AxisRepositionPreviewInProgress: {
								on: {
									StopAxisPreview: {
										target: 'None',
									},
								},
							},
							AxisCreatePreviewInProgress: {
								on: {
									StopAxisPreview: {
										target: 'None',
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
									ToggleClickMode: {
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
									ToggleClickMode: {
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
			/*ClearSelected: (ctx) => {
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
		 multipleSelectedIds: [ctx.selected.singleSelectedId, ...ids], // selectionBoxBounds: event.payload.selectionBoxBounds,
		 singleSelectedId: undefined,
		 })
		 }
		 return (ctx.selected = {
		 ...ctx.selected,
		 multipleSelectedIds: ids, // selectionBoxBounds: event.payload.selectionBoxBounds,
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
		 },*/

			SetMultipleSelectedEntities: (ctx, event) => {
				throw new Error('SetMultipleSelectedEntities not implemented')
			},

			/**
			 * Drag Box State Actions
			 */
			/*			SetSelectionBoxStart: (ctx, event) => {
		 return (ctx.dragBox = {
		 ...ctx.dragBox,
		 selectionBoxStart: event.payload.point,
		 })
		 },*/
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
			/*			SetPointerDown: (ctx, event) => {
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
		 },*/
			SetHoveredEntity: (ctx, event) => {
				return (ctx.pointer = {
					...ctx.pointer, // currentTransformedPoint: event.payload.point,
					hoveringEntityId: event.payload.id,
				})
			},
			ClearHoveredEntity: (ctx) => {
				return (ctx.pointer = {
					...ctx.pointer, // currentTransformedPoint: event.payload.point,
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
	},
)