import { StringsSelectors } from '../../index'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { rejectNil } from '@shared/utils'
import { firstValueFrom, map } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class StringsQueries {
	private _store = inject(Store)
	private _loaded$ = this._store.select(StringsSelectors.selectStringsLoaded)
	private _allStrings$ = this._store.select(StringsSelectors.selectAllStrings)

	// stringsFromRoute$ = this._store.select(StringsSelectors.selectStringsByRouteParams)

	public get totalStrings() {
		return firstValueFrom(this._allStrings$.pipe(map((strings) => strings.length)))
	}

	public stringById$(id: string) {
		return this._store.select(StringsSelectors.selectStringById({ id }))
	}

	public selectAllDefinedStrings$() {
		return this._store.select(StringsSelectors.selectAllDefinedStrings)
	}

	public stringByIdOrThrow$(id: string) {
		return this._store.select(StringsSelectors.selectStringById({ id })).pipe(rejectNil())
	}

	public stringById(id: string) {
		return firstValueFrom(this._store.select(StringsSelectors.selectStringById({ id })))
	}
}
