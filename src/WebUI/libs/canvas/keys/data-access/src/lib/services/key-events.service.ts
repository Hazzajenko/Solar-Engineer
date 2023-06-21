import { createStringWithPanels } from '@entities/utils'
import { MOVE_ENTITY_STATE, ObjectPositioningService, ObjectPositioningStoreService, ObjectRotatingService, ROTATE_ENTITY_STATE } from '@canvas/object-positioning/data-access'
import { RenderService } from '@canvas/rendering/data-access'
import { injectSelectedStore, SelectedService } from '@canvas/selected/data-access'
import { VIEW_STATE, ViewPositioningService } from '@canvas/view-positioning/data-access'
import { inject, Injectable } from '@angular/core'
import { Key, KEYS, Point, TransformedPoint } from '@shared/data-access/models'
import { KeysStoreService } from '../store'
import { KEY_MAP_ACTION } from '../types'
import { toSignal } from '@angular/core/rxjs-interop'
import { injectEntityStore } from '@entities/data-access'
import { injectAppStateStore, MODE_STATE } from '@canvas/app/data-access'
import { DIALOG_COMPONENT, injectUiStore } from '@overlays/ui-store/data-access'
import { assertNotNull } from '@shared/utils'

// const DEFAULT_UNCHANGEABLE_KEYS = [KEYS.ESCAPE, KEYS.SHIFT, KEYS.ALT, KEYS.CTRL_OR_CMD] as const
const isDefaultUnchangeableKey = (key: KeyboardEvent['key']) =>
	key === KEYS.ESCAPE ||
	key === KEYS.SHIFT ||
	key === KEYS.ALT ||
	key === KEYS.CTRL_OR_CMD ||
	key === KEYS.DELETE

// const isDefaultUnchangeableKey = (key: KeyboardEvent['key']) => DEFAULT_UNCHANGEABLE_KEYS.find(k => k === key)

@Injectable({
	providedIn: 'root',
})
export class KeyEventsService {
	private _selected = inject(SelectedService)
	private _selectedStore = injectSelectedStore()
	// private _selectedStore = inject(SelectedStoreService)
	private _uiStore = injectUiStore()
	private _entities = injectEntityStore()
	private _positioningStore = inject(ObjectPositioningStoreService)
	private _objRotating = inject(ObjectRotatingService)
	private _appStore = injectAppStateStore()
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
					this._objPositioning.stopMultipleEntitiesToMove(rawMousePos)
					return
				}
				if (moveState === MOVE_ENTITY_STATE.MOVING_SINGLE_ENTITY) {
					this._objPositioning.singleEntityToMoveMouseUp(event.altKey, currentPoint)

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
			case KEYS.DELETE: {
				const selectedState = this._selectedStore.select.selectedState()
				if (selectedState.multipleSelectedPanelIds.length) {
					this._entities.panels.dispatch.deleteManyPanels(selectedState.multipleSelectedPanelIds)
					this._render.renderCanvasApp()
					return
				}
				if (selectedState.singleSelectedPanelId) {
					this._entities.panels.dispatch.deletePanel(selectedState.singleSelectedPanelId)
					this._render.renderCanvasApp()
					return
				}
				if (selectedState.selectedStringId) {
					const string = this._entities.strings.select.getById(selectedState.selectedStringId)
					assertNotNull(string, 'KeyEventsService: keyUpHandlerV3: string not found')
					this._uiStore.dispatch.openDialog({
						component: DIALOG_COMPONENT.WARNING_TEMPLATE,
						data: {
							title: 'Delete String',
							message: `Are you sure you want to delete string ${string.name}?`,
							buttonText: 'Delete',
							buttonAction: () => {
								if (!selectedState.selectedStringId)
									throw new Error('KeyEventsService: keyUpHandlerV3: no selected string id')
								this._entities.strings.dispatch.deleteString(selectedState.selectedStringId)
								this._render.renderCanvasApp()
							},
						},
					})
					return
				}
				break
			}
			case KEYS.CTRL_OR_CMD: {
				const { moveEntityState, rotateEntityState } = this._positioningStore.state
				if (moveEntityState === MOVE_ENTITY_STATE.MOVING_MULTIPLE_ENTITIES) {
					this._objPositioning.stopMultipleEntitiesToMove(rawMousePos)
				}
				if (moveEntityState === MOVE_ENTITY_STATE.MOVING_SINGLE_ENTITY) {
					this._objPositioning.singleEntityToMoveMouseUp(event.altKey, currentPoint)
				}

				if (rotateEntityState === ROTATE_ENTITY_STATE.ROTATING_SINGLE_ENTITY) {
					this._objRotating.clearSingleToRotate()
				}

				if (rotateEntityState === ROTATE_ENTITY_STATE.ROTATING_MULTIPLE_ENTITIES) {
					this._objRotating.clearMultipleToRotate()
				}

				if (this._appStore.select.view() === VIEW_STATE.VIEW_DRAGGING_IN_PROGRESS) {
					this._view.handleDragScreenMouseUp()
				}
				break
			}
		}
	}

	private createStringWithSelected() {
		const multipleSelectedIds = this._selectedStore.select.multipleSelectedPanelIds()
		if (multipleSelectedIds.length <= 1) return
		const amountOfStrings = this._entities.strings.select.allStrings().length
		const { string, panelUpdates } = createStringWithPanels(multipleSelectedIds, amountOfStrings)
		this._entities.strings.dispatch.addStringWithPanels(string, panelUpdates)
		this._selectedStore.dispatch.selectStringId(string.id)
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
		const mode = this._appStore.select.mode()
		const newMode =
			mode === MODE_STATE.CREATE_MODE ? MODE_STATE.SELECT_MODE : MODE_STATE.CREATE_MODE
		this._appStore.dispatch.setModeState(newMode)
	}

	private startLinkMode() {
		const mode = this._appStore.select.mode()
		const newMode = mode !== MODE_STATE.LINK_MODE ? MODE_STATE.LINK_MODE : MODE_STATE.SELECT_MODE
		this._appStore.dispatch.setModeState(newMode)
	}
}
