import { initialSelectedState } from './selected.reducer';
import { selectMultiSelectedEntities, selectSelectedState, selectSingleSelectedEntity } from './selected.selectors';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { select, Store } from '@ngrx/store';
import { selectSelectedId } from '@projects/data-access';


// import { selectSelectedState } from 'deprecated/design-app/feature-selected'

@Injectable({
	providedIn: 'root',
})
export class SelectedQueries {
	private readonly _store = inject(Store)
	private readonly _selectedState$ = this._store.pipe(select(selectSelectedState))
	private readonly _selectedState = toSignal(this._selectedState$, {
		initialValue: initialSelectedState,
	})
	private readonly _singleSelected$ = this._store.pipe(select(selectSingleSelectedEntity))
	private readonly _multiSelected$ = this._store.pipe(select(selectMultiSelectedEntities))
	private readonly _selectedStringId$ = this._store.pipe(select(selectSelectedId))

	/*
	 private readonly _singleSelected$ = this._store.pipe(
	 select(selectSingleSelectedEntity),
	 )
	 private readonly _singleSelected = toSignal(this._singleSelected$, {initialValue: initialSelectedState.singleSelectedEntityId})
	 private readonly _multiSelected$ = this._store.pipe(
	 select(selectMultiSelectedEntities),
	 )
	 private readonly _multiSelected = toSignal(this._multiSelected$, {initialValue: initialSelectedState.multipleSelectedEntityIds})
	 private readonly _selectedStringId$ = this._store.pipe(
	 select(selectSelectedId),
	 )
	 private readonly _selectedStringId = toSignal(this._selectedStringId$, {initialValue: initialSelectedState.selectedStringId})
	 */

	get state() {
		return this._selectedState()
	}

	get selectedStringId$() {
		return this._selectedStringId$
	}

	get singleSelected$() {
		return this._singleSelected$
	}

	get multiSelected$() {
		return this._multiSelected$
	}
}