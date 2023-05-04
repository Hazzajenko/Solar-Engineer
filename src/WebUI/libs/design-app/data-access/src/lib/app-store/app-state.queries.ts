import { selectAppStateState } from './app-state.selectors'
import { inject, Injectable } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { select, Store } from '@ngrx/store'

@Injectable({
	providedIn: 'root',
})
export class AppStateQueries {
	private readonly _store = inject(Store)
	private readonly _state$ = this._store.pipe(select(selectAppStateState))
	private _state = toSignal(this._state$)

	constructor() {
		/*		effect(() => this._state$.pipe(
			tap(state => this._state = state),
		))*/
	}

	get state$() {
		return this._state$
	}

	get state() {
		return toSignal(this._state$)
	}
}
