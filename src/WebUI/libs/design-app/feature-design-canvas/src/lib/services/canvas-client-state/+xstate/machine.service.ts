import { Injectable } from '@angular/core'
import { canvasAppXStateService } from './machine-service'
import { XStateEvent } from './xstate-app-events.types'

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

	sendEvent(event: XStateEvent) {
		return this._appState.send(event)
	}
}
