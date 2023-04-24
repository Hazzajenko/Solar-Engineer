import { Injectable } from '@angular/core'
import { canvasAppXStateService } from './machine-service'
import { XStateEvent } from './xstate-app-events.types'
import { AppState, AppStateValue } from './xstate-app.states'

@Injectable({
	providedIn: 'root',
})
export class MachineService {
	private _appState = canvasAppXStateService

	get ctx() {
		return this._appState.getSnapshot().context
	}

	get snapshot() {
		return this._appState.getSnapshot()
	}

	get state() {
		return this.snapshot.value as AppStateValue
	}

	sendEvent(event: XStateEvent) {
		return this._appState.send(event)
	}

	matches(state: AppState) {
		return this.snapshot.matches(state as any)
	}
}
