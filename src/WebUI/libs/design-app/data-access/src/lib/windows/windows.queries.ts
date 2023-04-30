import { selectAllWindows, selectWindowsEntities } from './windows.selectors'
import { inject, Injectable } from '@angular/core'
import { DraggableWindow } from '@design-app/shared'
import { Dictionary } from '@ngrx/entity'
import { select, Store } from '@ngrx/store'
import { selectCanvasStringById } from 'deprecated/design-app/feature-design-canvas'
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

	get windowEntities$() {
		return this._windowEntities$
	}

	get allWindows$() {
		return this._allWindows$
	}

	windowById$(id: string) {
		return this._store.pipe(select(selectCanvasStringById({ id })))
	}

	windowById(id: string) {
		return firstValueFrom(this.windowById$(id))
	}
}