import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { KeysState } from './keys.reducer'
import { selectKeyMap, selectKeyMapValues, selectKeysState } from './keys.selectors'
import { KeysActions } from './keys.actions'
import { KeyMap } from './key-map'

@Injectable({
	providedIn: 'root',
})
export class KeysStoreService {
	private readonly _store = inject(Store<KeysState>)
	private readonly _state$ = this._store.select(selectKeysState)
	private readonly _keyMapValues$ = this._store.select(selectKeyMapValues)
	public dispatch = new KeysRepository(this._store)

	get state() {
		return this._store.selectSignal(selectKeysState)()
	}

	get keyMapValues() {
		return this._store.selectSignal(selectKeyMapValues)()
	}

	get keyMapValues$() {
		return this._store.select(selectKeyMapValues)
	}

	get keyMap() {
		return this._store.selectSignal(selectKeyMap)()
	}

	get keyMap$() {
		return this._store.select(selectKeyMap)
	}

	get state$() {
		return this._state$
	}
}

class KeysRepository {
	constructor(private _store: Store<KeysState>) {}

	updateKeyMap(keyMap: Partial<KeyMap>) {
		this._store.dispatch(KeysActions.updateKeyMap({ keyMap }))
	}

	resetKeyMapToDefault() {
		this._store.dispatch(KeysActions.resetKeyMapToDefault())
	}
}
