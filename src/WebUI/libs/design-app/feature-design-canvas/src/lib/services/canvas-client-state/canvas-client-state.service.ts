import { CanvasEntityState } from './canvas-entity-state'
import {
	CanvasClientState,
	DragBoxStateDeprecated,
	GridStateDeprecated,
	HoveringEntityState,
	InitialDragBoxState,
	InitialGridStateDeprecated,
	InitialHoveringEntityState,
	InitialMenuState,
	InitialModeState,
	InitialMouseState,
	InitialNearbyStateDeprecated,
	InitialSelectedState,
	InitialToMoveState,
	InitialToRotateState,
	InitialViewState,
	MenuState,
	ModeStateDeprecated,
	MouseState,
	NearbyStateDeprecated,
	SelectedStateDeprecated,
	StateUpdate,
	ToMoveStateDeprecated,
	ToRotateStateDeprecated,
	updateStateV3,
	ViewStateDeprecated,
} from './types'
import { inject, Injectable } from '@angular/core'


@Injectable({
	providedIn: 'root',
})
export class CanvasClientStateService implements CanvasClientState {
	private _hover: HoveringEntityState = InitialHoveringEntityState
	private _selected: SelectedStateDeprecated = InitialSelectedState
	private _toRotate: ToRotateStateDeprecated = InitialToRotateState
	private _toMove: ToMoveStateDeprecated = InitialToMoveState
	private _dragBox: DragBoxStateDeprecated = InitialDragBoxState
	private _mode: ModeStateDeprecated = InitialModeState
	private _view: ViewStateDeprecated = InitialViewState
	private _mouse: MouseState = InitialMouseState
	private _menu: MenuState = InitialMenuState
	private _nearby: NearbyStateDeprecated = InitialNearbyStateDeprecated
	private _grid: GridStateDeprecated = InitialGridStateDeprecated
	private _entities = inject(CanvasEntityState)

	get entities(): CanvasEntityState {
		return this._entities
	}

	get state(): CanvasClientState {
		return {
			hover: this.hover,
			selected: this.selected,
			toRotate: this.toRotate,
			toMove: this.toMove,
			dragBox: this.dragBox,
			mode: this.mode,
			view: this.view,
			mouse: this.mouse,
			menu: this.menu,
			nearby: this.nearby,
			grid: this.grid,
		}
	}

	private set state(value: CanvasClientState) {
		this._hover = value.hover
		this._selected = value.selected
		this._toRotate = value.toRotate
		this._toMove = value.toMove
		this._dragBox = value.dragBox
		this._mode = value.mode
		this._view = value.view
		this._mouse = value.mouse
		this._menu = value.menu
		this._nearby = value.nearby
		this._grid = value.grid
	}

	get hover(): HoveringEntityState {
		return this._hover
	}

	set hover(value: HoveringEntityState) {
		this._hover = value
	}

	get selected(): SelectedStateDeprecated {
		return this._selected
	}

	set selected(value: SelectedStateDeprecated) {
		this._selected = value
	}

	get toRotate(): ToRotateStateDeprecated {
		return this._toRotate
	}

	set toRotate(value: ToRotateStateDeprecated) {
		this._toRotate = value
	}

	get toMove(): ToMoveStateDeprecated {
		return this._toMove
	}

	set toMove(value: ToMoveStateDeprecated) {
		this._toMove = value
	}

	get dragBox(): DragBoxStateDeprecated {
		return this._dragBox
	}

	get mode(): ModeStateDeprecated {
		return this._mode
	}

	get view(): ViewStateDeprecated {
		return this._view
	}

	get mouse(): MouseState {
		return this._mouse
	}

	get menu(): MenuState {
		return this._menu
	}

	get nearby(): NearbyStateDeprecated {
		return this._nearby
	}

	get grid(): GridStateDeprecated {
		return this._grid
	}

	updateState(changes: StateUpdate) {
		if (changes.menu !== undefined) {
			console.log('menu', changes.menu)
		}
		if (changes.nearby !== undefined) {
			// console.log('nearby', changes.nearby)
		}
		if (changes.selected !== undefined) {
			if (changes.selected.singleSelectedId !== undefined) {
				/*        canvasAppXStateService.send({
				 type:    'ClickOnEntity',
				 payload: {
				 id: changes.selected.singleSelectedId,
				 },
				 })*/
				// sendStateEvent(new SelectedSingleEntity({ id: changes.selected.singleSelectedId }))
				// canvasAppXStateService.send(new ClickOnEntity({ id: changes.selected.singleSelectedId }))
			} else {
				// sendStateEvent(new ClearEntitySelected())
				/*        canvasAppXStateService.send({
				 type:    'ClearEntitySelected',
				 payload: null,
				 })*/
			}

			/*    if  (changes.selected.multipleSelectedIds !== undefined) {
			 canvasAppXStateService.send({
			 type:    'ClickElsewhere',
			 payload: null,
			 })
			 }*/
			/*      canvasAppXStateService.send({
			 type:    'ClickElsewhere',
			 payload: null,
			 })*/
		}
		this.state = updateStateV3(this.state, changes)
		return
	}

	/*  updateStateV2(fn: (changes: CanvasClientStateUpdatePartial) => CanvasClientStateUpdatePartial)  {
	 this.updateState(fn({}))
	 }*/

	getState(): CanvasClientState {
		return this.state
	}

	getSpecificState<TState>(state: keyof CanvasClientState): TState {
		return this.state[state] as TState
	}
}