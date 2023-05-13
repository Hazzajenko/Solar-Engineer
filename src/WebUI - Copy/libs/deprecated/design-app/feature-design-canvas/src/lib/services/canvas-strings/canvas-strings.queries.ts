import { CanvasString } from '../../types/canvas-string'
import { inject, Injectable } from '@angular/core'
import { Dictionary } from '@ngrx/entity'
import { select, Store } from '@ngrx/store'
import {
	selectAllCanvasStrings,
	selectCanvasStringById,
	selectCanvasStringsByIdArray,
	selectCanvasStringsViaDictionary,
} from 'deprecated/design-app/feature-design-canvas'
import { firstValueFrom, Observable } from 'rxjs'

@Injectable({
	providedIn: 'root',
})
export class CanvasStringsQueries {
	private readonly _store = inject(Store)
	private readonly _stringEntities$: Observable<Dictionary<CanvasString>> = this._store.pipe(
		select(selectCanvasStringsViaDictionary),
	)
	private readonly _allStrings$: Observable<CanvasString[]> = this._store.pipe(
		select(selectAllCanvasStrings),
	)

	public get stringEntities$() {
		return this._stringEntities$
	}

	public get allStrings$() {
		return this._allStrings$
	}

	public stringById$(id: string) {
		return this._store.pipe(select(selectCanvasStringById({ id })))
	}

	public stringById(id: string) {
		return firstValueFrom(this.stringById$(id))
	}

	public stringsByIdArray$(ids: string[]) {
		return this._store.pipe(select(selectCanvasStringsByIdArray({ ids })))
	}

	public stringsByIdArray(ids: string[]) {
		return firstValueFrom(this.stringsByIdArray$(ids))
	}
}
