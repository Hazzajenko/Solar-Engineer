import { WindowsActions } from './windows.actions'
import { inject, Injectable } from '@angular/core'
import { UpdateStr } from '@ngrx/entity/src/models'
import { Store } from '@ngrx/store'
import { DraggableWindow } from '@shared/data-access/models'

@Injectable({
	providedIn: 'root',
})
export class WindowsRepository {
	private _store = inject(Store)

	addWindow(window: DraggableWindow) {
		this._store.dispatch(WindowsActions.addWindow({ window }))
	}

	updateWindow(update: UpdateStr<DraggableWindow>) {
		this._store.dispatch(WindowsActions.updateWindow({ update }))
	}

	deleteWindow(windowId: string) {
		this._store.dispatch(WindowsActions.deleteWindow({ windowId }))
	}

	clearWindowsState() {
		this._store.dispatch(WindowsActions.clearWindowsState())
	}
}
