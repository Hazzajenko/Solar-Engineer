import { AppState, initialAppState } from './app-state.reducer'
import {
	selectAppStateState,
	selectContextMenuState,
	selectDragBoxState,
	selectModeState,
	selectPointerState,
	selectPreviewAxisState,
	selectToMoveState,
	selectToRotateState,
	selectViewPositioningState,
} from './app-state.selectors'
import { DragBoxState } from './app-state.types'
import { effect, inject, Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { select, Store } from '@ngrx/store'
import { map } from 'rxjs'


@Injectable({
	providedIn: 'root',
})
export class AppStateQueries {
	private readonly _store = inject(Store)
	private readonly _state$ = this._store.pipe(select(selectAppStateState))
	private readonly _state = toSignal(this._state$, { initialValue: initialAppState })
	private readonly _dragBox$ = this._store.pipe(select(selectDragBoxState))
	private readonly _dragBox = toSignal(this._dragBox$, { initialValue: initialAppState.dragBox })
	private readonly _pointer$ = this._store.pipe(select(selectPointerState))
	private readonly _pointer = toSignal(this._pointer$, { initialValue: initialAppState.pointer })
	private readonly _toMove$ = this._store.pipe(select(selectToMoveState))
	private readonly _toMove = toSignal(this._toMove$, { initialValue: initialAppState.toMove })
	private readonly _toRotate$ = this._store.pipe(select(selectToRotateState))
	private readonly _toRotate = toSignal(this._toRotate$, { initialValue: initialAppState.toRotate })
	// private readonly _selected$ = this._store.pipe(select(selectSelectedState))
	// private readonly _selected = toSignal(this._selected$, { initialValue: initialAppState.selected })
	private readonly _contextMenu$ = this._store.pipe(select(selectContextMenuState))
	private readonly _contextMenu = toSignal(this._contextMenu$, {
		initialValue: initialAppState.contextMenu,
	})
	private readonly _mode$ = this._store.pipe(select(selectModeState))
	private readonly _mode = toSignal(this._mode$, { initialValue: initialAppState.mode })
	private readonly _previewAxis$ = this._store.pipe(select(selectPreviewAxisState))
	private readonly _previewAxis = toSignal(this._previewAxis$, {
		initialValue: initialAppState.previewAxis,
	})
	private readonly _viewPositioning$ = this._store.pipe(select(selectViewPositioningState))
	private readonly _viewPositioning = toSignal(this._viewPositioning$, {
		initialValue: initialAppState.view,
	})

	constructor() {
		effect(() => console.log('AppStateQueries constructor', this._state()))
	}

	get state$() {
		return this._state$
	}

	get state() {
		return this._state()
	}

	get dragBox() {
		return this._dragBox
	}

	get pointer() {
		return this._pointer
	}

	get toMove() {
		return this._toMove
	}

	get toRotate() {
		return this._toRotate
	}

	/*	get selected() {
	 return this._selected
	 }*/

	get contextMenu() {
		return this._contextMenu
	}

	get mode() {
		return this._mode
	}

	get previewAxis() {
		return this._previewAxis
	}

	get viewPositioning() {
		return this._viewPositioning
	}

	get options() {
		return {
			dragBox: (dragBox: DragBoxState) => this.matchesDragBox(dragBox),
		}
	}

	private matchesDragBox(dragBox: DragBoxState) {
		return this._state().dragBox === dragBox
	}

	// }

	oneState(key: keyof AppState) {
		return this._state()[key]
	}

	oneState$<K extends keyof AppState>(key: K) {
		return this._state$.pipe(map((state) => state[key]))
	}
}