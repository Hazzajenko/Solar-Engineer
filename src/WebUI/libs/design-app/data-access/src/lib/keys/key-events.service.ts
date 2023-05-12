import { AppStateStoreService, MODE_STATE } from '../app-store'
import { createStringWithPanelsV2, EntityStoreService, genStringNameV2 } from '../entities'
import { ObjectPositioningService } from '../object-positioning'
import { MOVE_ENTITY_STATE, ObjectPositioningStoreService, ROTATE_ENTITY_STATE } from '../object-positioning-store'
import { ObjectRotatingService } from '../object-rotating'
import { RenderService } from '../render'
import { SelectedService, SelectedStoreService } from '../selected'
import { ViewPositioningService } from '../view'
import { inject, Injectable } from '@angular/core'
import { CanvasPanel, TransformedPoint } from '@design-app/shared'
import { createString, updateObjectByIdForStoreV3 } from '@design-app/utils'
import { Key, KEYS, Point } from '@shared/data-access/models'
import { VIEW_STATE } from 'deprecated/design-app/feature-design-canvas'
import { KeysStoreService } from './keys-store.service'
import { KEY_MAP_ACTION } from './key-map'
import { toSignal } from '@angular/core/rxjs-interop'

// const DEFAULT_UNCHANGEABLE_KEYS = [KEYS.ESCAPE, KEYS.SHIFT, KEYS.ALT, KEYS.CTRL_OR_CMD] as const
const isDefaultUnchangeableKey = (key: KeyboardEvent['key']) =>
	key === KEYS.ESCAPE || key === KEYS.SHIFT || key === KEYS.ALT || key === KEYS.CTRL_OR_CMD

// const isDefaultUnchangeableKey = (key: KeyboardEvent['key']) => DEFAULT_UNCHANGEABLE_KEYS.find(k => k === key)

@Injectable({
	providedIn: 'root',
})
export class KeyEventsService {
	private _selected = inject(SelectedService)
	private _selectedStore = inject(SelectedStoreService)
	private _entities = inject(EntityStoreService)
	private _positioningStore = inject(ObjectPositioningStoreService)
	private _objRotating = inject(ObjectRotatingService)
	private _appState = inject(AppStateStoreService)
	private _render = inject(RenderService)
	private _objPositioning = inject(ObjectPositioningService)
	private _view = inject(ViewPositioningService)
	private _keyMapStore = inject(KeysStoreService)
	_keyMapValues = toSignal(this._keyMapStore.keyMapValues$, {
		initialValue: this._keyMapStore.keyMapValues,
	})
	get keyMapValues() {
		return this._keyMapValues()
	}

	// keyMapValues = this._keyMapStore.keyMapValues

	keyUpHandlerV4(event: KeyboardEvent, rawMousePos: Point, currentPoint: TransformedPoint) {
		if (isDefaultUnchangeableKey(event.key))
			return this.keyUpHandlerV3(event, rawMousePos, currentPoint)
		const key = event.key as Key
		const action = this.keyMapValues[key]
		console.log('keyUpHandlerV4: action: ', action)
		if (!action) return
		switch (action) {
			case KEY_MAP_ACTION.CREATE_STRING_WITH_SELECTED:
				return this.createStringWithSelected()
			case KEY_MAP_ACTION.START_ROTATE_MODE:
				return this.startRotateMode()
			case KEY_MAP_ACTION.TOGGLE_MODE:
				return this.toggleMode()
			case KEY_MAP_ACTION.START_LINK_MODE:
				return this.startLinkMode()
			default:
				throw new Error(`KeyEventsService: keyUpHandlerV4: unknown action: ${action}`)
		}
	}

	private createStringWithSelected() {
		const multipleSelectedIds = this._selectedStore.state.multipleSelectedEntityIds
		if (multipleSelectedIds.length <= 1) return
		const amountOfStrings = this._entities.strings.allStrings.length
		const { string, panelUpdates } = createStringWithPanelsV2(multipleSelectedIds, amountOfStrings)
		this._entities.strings.dispatch.addString(string)
		this._entities.panels.dispatch.updateManyPanels(panelUpdates)
	}

	private startRotateMode() {
		const rotateState = this._positioningStore.state.rotateEntityState
		if (rotateState === ROTATE_ENTITY_STATE.ROTATING_SINGLE_ENTITY) {
			this._objRotating.clearSingleToRotate()
			return
		}
		if (rotateState === ROTATE_ENTITY_STATE.ROTATING_MULTIPLE_ENTITIES) {
			this._objRotating.clearMultipleToRotate()
			return
		}
	}

	private toggleMode() {
		const mode = this._appState.state.mode
		const newMode =
			mode === MODE_STATE.CREATE_MODE ? MODE_STATE.SELECT_MODE : MODE_STATE.CREATE_MODE
		this._appState.dispatch.setModeState(newMode)
	}

	private startLinkMode() {
		const mode = this._appState.state.mode
		const newMode = mode !== MODE_STATE.LINK_MODE ? MODE_STATE.LINK_MODE : MODE_STATE.SELECT_MODE
		this._appState.dispatch.setModeState(newMode)
	}

	keyUpHandlerV3(event: KeyboardEvent, rawMousePos: Point, currentPoint: TransformedPoint) {
		switch (event.key) {
			case KEYS.ESCAPE: {
				this._selected.clearSelectedInOrder()
				this._render.renderCanvasApp()
				break
			}
			case KEYS.SHIFT: {
				const moveState = this._positioningStore.state.moveEntityState
				if (moveState === MOVE_ENTITY_STATE.MOVING_MULTIPLE_ENTITIES) {
					this._objPositioning.stopMultiSelectDragging(rawMousePos)
					return
				}
				if (moveState === MOVE_ENTITY_STATE.MOVING_SINGLE_ENTITY) {
					this._objPositioning.singleToMoveMouseUp(event.altKey, currentPoint)

					return
				}
				break
			}
			case KEYS.ALT: {
				const rotateState = this._positioningStore.state.rotateEntityState
				if (rotateState === ROTATE_ENTITY_STATE.ROTATING_SINGLE_ENTITY) {
					this._objRotating.clearSingleToRotate()
					return
				}
				if (rotateState === ROTATE_ENTITY_STATE.ROTATING_MULTIPLE_ENTITIES) {
					this._objRotating.clearMultipleToRotate()
					return
				}
				break
			}
			case KEYS.CTRL_OR_CMD: {
				const { moveEntityState, rotateEntityState } = this._positioningStore.state
				if (moveEntityState === MOVE_ENTITY_STATE.MOVING_MULTIPLE_ENTITIES) {
					this._objPositioning.stopMultiSelectDragging(rawMousePos)
				}
				if (moveEntityState === MOVE_ENTITY_STATE.MOVING_SINGLE_ENTITY) {
					this._objPositioning.singleToMoveMouseUp(event.altKey, currentPoint)
				}

				if (rotateEntityState === ROTATE_ENTITY_STATE.ROTATING_SINGLE_ENTITY) {
					this._objRotating.clearSingleToRotate()
				}

				if (rotateEntityState === ROTATE_ENTITY_STATE.ROTATING_MULTIPLE_ENTITIES) {
					this._objRotating.clearMultipleToRotate()
				}

				if (this._appState.state.view === VIEW_STATE.VIEW_DRAGGING_IN_PROGRESS) {
					this._view.handleDragScreenMouseUp()
				}
				break
			}
		}
	}

	keyUpHandlerV2 = (event: KeyboardEvent, rawMousePos: Point, currentPoint: TransformedPoint) => {
		return (
			{
				[KEYS.ESCAPE]: () => {
					this._selected.clearSelectedInOrder()
					this._render.renderCanvasApp()
				},
				[KEYS.X]: () => {
					const multipleSelectedIds = this._selectedStore.state.multipleSelectedEntityIds
					if (multipleSelectedIds.length <= 1) return
					const amountOfStrings = this._entities.strings.allStrings.length
					const { string, panelUpdates } = createStringWithPanelsV2(
						multipleSelectedIds,
						amountOfStrings,
					)
					this._entities.strings.dispatch.addString(string)
					this._entities.panels.dispatch.updateManyPanels(panelUpdates)

					// this._selectedStore.dispatch.selectString(string.id)
					this._render.renderCanvasApp()
				},
				[KEYS.R]: () => {
					const rotateState = this._positioningStore.state.rotateEntityState
					if (rotateState === ROTATE_ENTITY_STATE.ROTATING_SINGLE_ENTITY) {
						this._objRotating.clearSingleToRotate()
						return
					}
					if (rotateState === ROTATE_ENTITY_STATE.ROTATING_MULTIPLE_ENTITIES) {
						this._objRotating.clearMultipleToRotate()
						return
					}
				},
				[KEYS.C]: () => {
					const mode = this._appState.state.mode
					const newMode =
						mode === MODE_STATE.CREATE_MODE ? MODE_STATE.SELECT_MODE : MODE_STATE.CREATE_MODE
					this._appState.dispatch.setModeState(newMode)
				},
				[KEYS.SHIFT]: () => {
					const moveState = this._positioningStore.state.moveEntityState
					if (moveState === MOVE_ENTITY_STATE.MOVING_MULTIPLE_ENTITIES) {
						this._objPositioning.stopMultiSelectDragging(rawMousePos)
						return
					}
					if (moveState === MOVE_ENTITY_STATE.MOVING_SINGLE_ENTITY) {
						this._objPositioning.singleToMoveMouseUp(event.altKey, currentPoint)

						return
					}
				},
				[KEYS.ALT]: () => {
					const rotateState = this._positioningStore.state.rotateEntityState
					if (rotateState === ROTATE_ENTITY_STATE.ROTATING_SINGLE_ENTITY) {
						this._objRotating.clearSingleToRotate()
						return
					}
					if (rotateState === ROTATE_ENTITY_STATE.ROTATING_MULTIPLE_ENTITIES) {
						this._objRotating.clearMultipleToRotate()
						return
					}
				},
				[KEYS.CTRL_OR_CMD]: () => {
					const { moveEntityState, rotateEntityState } = this._positioningStore.state
					if (moveEntityState === MOVE_ENTITY_STATE.MOVING_MULTIPLE_ENTITIES) {
						this._objPositioning.stopMultiSelectDragging(rawMousePos)
					}
					if (moveEntityState === MOVE_ENTITY_STATE.MOVING_SINGLE_ENTITY) {
						this._objPositioning.singleToMoveMouseUp(event.altKey, currentPoint)
					}

					if (rotateEntityState === ROTATE_ENTITY_STATE.ROTATING_SINGLE_ENTITY) {
						this._objRotating.clearSingleToRotate()
					}

					if (rotateEntityState === ROTATE_ENTITY_STATE.ROTATING_MULTIPLE_ENTITIES) {
						this._objRotating.clearMultipleToRotate()
					}

					if (this._appState.state.view === VIEW_STATE.VIEW_DRAGGING_IN_PROGRESS) {
						this._view.handleDragScreenMouseUp()
					}
				},
			}[event.key] ||
			(() => {
				console.log('unknown key', event)
			})
		)()
	}

	keyUpHandler(event: KeyboardEvent, rawMousePos: Point, currentPoint: TransformedPoint) {
		switch (event.key) {
			case KEYS.ESCAPE:
				this._selected.clearSelectedInOrder()
				this._render.renderCanvasApp()
				break
			case KEYS.X:
				{
					const multipleSelectedIds = this._selectedStore.state.multipleSelectedEntityIds
					// const multipleSelectedIds = this._app.selectedCtx.multipleSelectedIds
					// const multipleSelectedIds = this._app.selectedCtx.multipleSelectedIds
					if (multipleSelectedIds.length <= 1) return
					const name = genStringNameV2(this._entities.strings.allStrings)
					const string = createString(name)

					const entities = this._entities.panels.getByIds(multipleSelectedIds)
					const panels = entities.filter((entity) => entity.type === 'panel') as CanvasPanel[]
					/*				const panelUpdates = panels.map((panel) =>
				 updateObjectByIdForStore<CanvasPanel>(panel.id, { stringId: string.id }),
				 )*/
					const panelUpdates = panels.map(
						updateObjectByIdForStoreV3<CanvasPanel>({ stringId: string.id }),
					)
					this._entities.strings.dispatch.addString(string)
					this._entities.panels.dispatch.updateManyPanels(panelUpdates)

					this._selectedStore.dispatch.selectString(string.id)
					this._render.renderCanvasApp()
				}
				break
			case KEYS.R:
				{
					const rotateState = this._positioningStore.state.rotateEntityState
					if (rotateState === ROTATE_ENTITY_STATE.ROTATING_SINGLE_ENTITY) {
						this._objRotating.clearSingleToRotate()
						return
					}
					if (rotateState === ROTATE_ENTITY_STATE.ROTATING_MULTIPLE_ENTITIES) {
						this._objRotating.clearMultipleToRotate()
						return
					}
				}
				break
			case KEYS.C: {
				const mode = this._appState.state.mode
				const newMode =
					mode === MODE_STATE.CREATE_MODE ? MODE_STATE.SELECT_MODE : MODE_STATE.CREATE_MODE
				this._appState.dispatch.setModeState(newMode)
				return
			}
			case KEYS.M:
				break
			case KEYS.SHIFT: {
				const moveState = this._positioningStore.state.moveEntityState
				if (moveState === MOVE_ENTITY_STATE.MOVING_MULTIPLE_ENTITIES) {
					this._objPositioning.stopMultiSelectDragging(rawMousePos)
					return
				}
				if (moveState === MOVE_ENTITY_STATE.MOVING_SINGLE_ENTITY) {
					this._objPositioning.singleToMoveMouseUp(event.altKey, currentPoint)

					return
				}
				break
			}
			case KEYS.ALT: {
				const rotateState = this._positioningStore.state.rotateEntityState
				if (rotateState === ROTATE_ENTITY_STATE.ROTATING_SINGLE_ENTITY) {
					this._objRotating.clearSingleToRotate()
					return
				}
				if (rotateState === ROTATE_ENTITY_STATE.ROTATING_MULTIPLE_ENTITIES) {
					this._objRotating.clearMultipleToRotate()
					return
				}
				break
			}
			case KEYS.CTRL_OR_CMD: {
				const { moveEntityState, rotateEntityState } = this._positioningStore.state
				if (moveEntityState === MOVE_ENTITY_STATE.MOVING_MULTIPLE_ENTITIES) {
					this._objPositioning.stopMultiSelectDragging(rawMousePos)
				}
				if (moveEntityState === MOVE_ENTITY_STATE.MOVING_SINGLE_ENTITY) {
					this._objPositioning.singleToMoveMouseUp(event.altKey, currentPoint)
				}

				if (rotateEntityState === ROTATE_ENTITY_STATE.ROTATING_SINGLE_ENTITY) {
					this._objRotating.clearSingleToRotate()
				}

				if (rotateEntityState === ROTATE_ENTITY_STATE.ROTATING_MULTIPLE_ENTITIES) {
					this._objRotating.clearMultipleToRotate()
				}

				if (this._appState.state.view === VIEW_STATE.VIEW_DRAGGING_IN_PROGRESS) {
					this._view.handleDragScreenMouseUp()
				}
				break
			}
		}
	}
}
