import { Injectable } from '@angular/core'
import { CanvasClientState, HoveringEntityState, SelectedState, ToMoveState, ToRotateState } from './canvas-client-state'

@Injectable({
  providedIn: 'root',
})
export class CanvasClientStateService
  implements CanvasClientState {
  private _hover: HoveringEntityState = undefined
  private _selected: SelectedState = {
    ids:              [],
    entities:         {},
    selectedStringId: undefined,
    singleSelectedId: undefined,
  }

  private _toRotate: ToRotateState = {
    ids:                  [],
    entities:             {},
    singleToRotateEntity: undefined,
  }

  private _toMove: ToMoveState = {
    ids:                [],
    entities:           {},
    singleToMoveEntity: undefined,
  }

  updater: {
    hover: (hover: HoveringEntityState) => void
    selected: (selected: Partial<SelectedState>) => void
    toRotate: (toRotate: Partial<ToRotateState>) => void
    toMove: (toMove: Partial<ToMoveState>) => void
    // toRotate: (toRotate: ToRotateState) => void
    // toMove:   (toMove: ToMoveState) => void
  } = {
    hover:    (hover: HoveringEntityState) => this.updateState({ hover }),
    selected: (selected: Partial<SelectedState>) => this.updateSelected({ ...selected }),
    toRotate: (toRotate: Partial<ToRotateState>) => this.updateToRotate({ ...toRotate }),
    toMove:   (toMove: Partial<ToMoveState>) => this.updateToMove({ ...toMove }),
    // toRotate: (toRotate: ToRotateState) => this.updateState({ toRotate }),
    // toMove:   (toMove: ToMoveState) => this.updateState({ toMove }),
  }

  get state(): CanvasClientState {
    return {
      hover:    this.hover,
      selected: this.selected,
      toRotate: this.toRotate,
      toMove:   this.toMove,
    }
  }

  /*  get updater(): (changes: Partial<CanvasClientState>) => void {
   return (changes: Partial<CanvasClientState>) => {
   this.updateState(changes)
   }
   }*/

  updateState(changes: Partial<CanvasClientState>) {
    if (changes.hover !== undefined) {
      this.hover = changes.hover
    }
    if (changes.selected !== undefined) {
      this.selected = changes.selected
    }
    if (changes.toRotate !== undefined) {
      this.toRotate = changes.toRotate
    }
    if (changes.toMove !== undefined) {
      this.toMove = changes.toMove
    }
  }

  updateHover(changes: HoveringEntityState) {
    this.hover = changes
  }

  updateSelected(changes: Partial<SelectedState>) {
    this.selected = {
      ...this.selected,
      ...changes,
    }
  }

  updateToRotate(changes: Partial<ToRotateState>) {
    this.toRotate = {
      ...this.toRotate,
      ...changes,
    }
  }

  updateToMove(changes: Partial<ToMoveState>) {
    this.toMove = {
      ...this.toMove,
      ...changes,
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

}
