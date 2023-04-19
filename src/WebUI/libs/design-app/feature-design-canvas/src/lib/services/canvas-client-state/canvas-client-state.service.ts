import { inject, Injectable } from '@angular/core'
import { CanvasClientState, CanvasClientStateUpdatePartial, DragBoxState, HoveringEntityState, InitialDragBoxState, InitialHoveringEntityState, InitialSelectedState, InitialToMoveState, InitialToRotateState, SelectedState, ToMoveState, ToRotateState } from './types'
import { InitialModeState, ModeState } from './types/mode'
import { InitialViewState, ViewState } from './types/view'
import { CanvasEntityState } from './canvas-entity-state'
import { InitialMouseState, MouseState } from './types/mouse'

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
  // private _render = inject(CanvasRenderService)
  private _entity = inject(CanvasEntityState)

  // private _entity: CanvasEntityState = new CanvasEntityState()

  get entity(): CanvasEntityState {
    return this._entity
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
    }
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

  updateState(changes: CanvasClientStateUpdatePartial) {
    if (changes.hover !== undefined) {
      this._hover = {
        ...this.hover,
        ...changes.hover,
      }
    }
    if (changes.selected !== undefined) {
      this._selected = {
        ...this.selected,
        ...changes.selected,
      }
      console.log('selected', changes.selected)
    }

    if (changes.toRotate !== undefined) {
      this._toRotate = {
        ...this.toRotate,
        ...changes.toRotate,
      }
    }
    if (changes.toMove !== undefined) {
      this._toMove = {
        ...this.toMove,
        ...changes.toMove,
      }
    }
    if (changes.dragBox !== undefined) {
      this._dragBox = {
        ...this.dragBox,
        ...changes.dragBox,
      }
      console.log('dragBox', this.dragBox)
    }
    if (changes.mode !== undefined) {
      this._mode = {
        ...this.mode,
        ...changes.mode,
      }
    }
    if (changes.view !== undefined) {
      this._view = {
        ...this.view,
        ...changes.view,
      }
    }
    if (changes.mouse !== undefined) {
      this._mouse = {
        ...this.mouse,
        ...changes.mouse,
      }
      console.log('mouse', this.mouse)
    }
  }

  getState(): CanvasClientState {
    return this.state
  }
}
