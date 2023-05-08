import { AppStateStoreService, MODE_STATE } from '../app-store'
import { createStringWithPanelsV2, EntityStoreService, genStringNameV2 } from '../entities'
import { ObjectPositioningService } from '../object-positioning'
import {
	MOVE_ENTITY_STATE,
	ObjectPositioningStoreService,
	ROTATE_ENTITY_STATE,
} from '../object-positioning-store'
import { ObjectRotatingService } from '../object-rotating'
import { RenderService } from '../render'
import { SelectedService, SelectedStoreService } from '../selected'
import { ViewPositioningService } from '../view'
import { inject, Injectable } from '@angular/core'
import { CanvasPanel, TransformedPoint } from '@design-app/shared'
import { createString, updateObjectByIdForStoreV3 } from '@design-app/utils'
import { KEYS, Point } from '@shared/data-access/models'
import { VIEW_STATE } from 'deprecated/design-app/feature-design-canvas'

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

					this._selectedStore.dispatch.selectString(string.id)
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
