import { AppState, initialAppState } from './app-state.reducer'
import { selectAppStateState } from './app-state.selectors'
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
	private _state = toSignal(this._state$, { initialValue: initialAppState })

	constructor() {
		effect(() => console.log('AppStateQueries constructor', this._state()))
	}

	get state$() {
		return this._state$
	}

	get state() {
		return this._state
		// return toSignal(this._state$)
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
