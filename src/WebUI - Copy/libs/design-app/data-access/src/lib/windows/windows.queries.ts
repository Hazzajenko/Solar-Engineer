import {
	selectAllClosedWindows,
	selectAllOpenWindows,
	selectAllWindows,
	selectWindowById,
	selectWindowsEntities,
} from './windows.selectors'
import { inject, Injectable } from '@angular/core'
import { DraggableWindow } from '@design-app/shared'
import { Dictionary } from '@ngrx/entity'
import { select, Store } from '@ngrx/store'
import { firstValueFrom, Observable } from 'rxjs'


@Injectable({
	providedIn: 'root',
})
export class WindowsQueries {
	private readonly _store = inject(Store)
	private readonly _windowEntities$: Observable<Dictionary<DraggableWindow>> = this._store.pipe(
		select(selectWindowsEntities),
	)
	private readonly _allWindows$: Observable<DraggableWindow[]> = this._store.pipe(
		select(selectAllWindows),
	)

	private readonly _openWindows$: Observable<DraggableWindow[]> = this._store.pipe(
		select(selectAllOpenWindows),
	)

	private readonly _closedWindows$: Observable<DraggableWindow[]> = this._store.pipe(
		select(selectAllClosedWindows),
	)

	get windowEntities$() {
		return this._windowEntities$
	}

	get allWindows$() {
		return this._allWindows$
	}

	get openWindows$() {
		return this._openWindows$
	}

	get closedWindows$() {
		return this._closedWindows$
	}

	windowById$(id: string) {
		return this._store.pipe(select(selectWindowById({ id })))
	}

	windowById(id: string) {
		return firstValueFrom(this.windowById$(id))
	}
}