import { inject, Injectable } from '@angular/core'
import { CanvasClientState, DragBoxState, HoveringEntityState, InitialDragBoxState, InitialHoveringEntityState, InitialMenuState, InitialModeState, InitialMouseState, InitialNearbyState, InitialSelectedState, InitialToMoveState, InitialToRotateState, InitialViewState, MenuState, ModeState, MouseState, NearbyState, SelectedState, StateUpdate, ToMoveState, ToRotateState, updateStateV3, ViewState } from './types'
import { CanvasEntityState } from './canvas-entity-state'

@Injectable({
  providedIn: 'root',
})
export class CanvasClientStateService
  implements CanvasClientState {
  private _hover: HoveringEntityState = InitialHoveringEntityState
  private _selected: SelectedState = InitialSelectedState
  private _toRotate: ToRotateState = InitialToRotateState
  private _toMove: ToMoveState = InitialToMoveState
  private _dragBox: DragBoxState = InitialDragBoxState
  private _mode: ModeState = InitialModeState
  private _view: ViewState = InitialViewState
  private _mouse: MouseState = InitialMouseState
  private _menu: MenuState = InitialMenuState
  private _nearby: NearbyState = InitialNearbyState
  private _entities = inject(CanvasEntityState)

  get entities(): CanvasEntityState {
    return this._entities
  }

  get state(): CanvasClientState {
    return {
      hover:    this.hover,
      selected: this.selected,
      toRotate: this.toRotate,
      toMove:   this.toMove,
      dragBox:  this.dragBox,
      mode:     this.mode,
      view:     this.view,
      mouse:    this.mouse,
      menu:     this.menu,
      nearby:   this.nearby,
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
  }

  get hover(): HoveringEntityState {
    return this._hover
  }

  set hover(value: HoveringEntityState) {
    this._hover = value
  }

  get selected(): SelectedState {
    return this._selected
  }

  set selected(value: SelectedState) {
    this._selected = value
  }

  get toRotate(): ToRotateState {
    return this._toRotate
  }

  set toRotate(value: ToRotateState) {
    this._toRotate = value
  }

  get toMove(): ToMoveState {
    return this._toMove
  }

  set toMove(value: ToMoveState) {
    this._toMove = value
  }

  get dragBox(): DragBoxState {
    return this._dragBox
  }

  get mode(): ModeState {
    return this._mode
  }

  get view(): ViewState {
    return this._view
  }

  get mouse(): MouseState {
    return this._mouse
  }

  get menu(): MenuState {
    return this._menu
  }

  get nearby(): NearbyState {
    return this._nearby
  }

  updateState(changes: StateUpdate) {
    if (changes.menu !== undefined) {
      console.log('menu', changes.menu)
    }
    if (changes.nearby !== undefined) {
      // console.log('nearby', changes.nearby)
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
