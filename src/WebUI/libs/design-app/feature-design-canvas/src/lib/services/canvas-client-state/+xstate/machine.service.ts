import { canvasAppXStateService } from './machine-service'
import { XStateEvent } from './xstate-app-events.types'
import { AppStateMatches, AppStateValue } from './xstate-app.states'
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'


@Injectable({
	providedIn: 'root',
})
export class MachineService {
	private _machine = canvasAppXStateService
	private _state$ = new BehaviorSubject<AppStateMatches>(this.snapshot.value as AppStateMatches)

	// private _state$ = new BehaviorSubject<AppStateValue>(this.state)

	constructor() {
		this._machine.start()
		this._machine.onTransition((state) => {
			this._state$.next(state.value as AppStateMatches)
			// this._state$.next(state.value as AppStateValue)
		})
	}

	get ctx() {
		return this._machine.getSnapshot().context
	}

	get snapshot() {
		return this._machine.getSnapshot()
	}

	get state() {
		return this.snapshot.value as AppStateValue
	}

	sendEvent(event: XStateEvent) {
		return this._machine.send(event)
	}

	/*	transition() {
	 return this._machine.getSnapshot().machine?.transition()
	 }*/

	subscribe() {
		return this._state$.asObservable()
	}

	matches(matches: AppStateMatches) {
		return this.snapshot.matches(matches)
	}
}