import { canvasAppXStateService } from './machine-service'
import { XStateEvent } from './xstate-app-events.types'
import { AppStateMatches, AppStateMatchesModel } from './xstate-app.states'
import { Injectable } from '@angular/core'
import { EntityType } from '@design-app/shared'
import { BehaviorSubject } from 'rxjs'


@Injectable({
	providedIn: 'root',
})
export class MachineService {
	private _machine = canvasAppXStateService
	private _state$ = new BehaviorSubject<AppStateMatches>(this.snapshot.value as AppStateMatches)
	private _contextMenu$ = new BehaviorSubject<
		| {
				x: number
				y: number
				id: string
				type: EntityType
		  }
		| undefined
	>(this.snapshot.context.view.contextMenu)

	// private _state$ = new BehaviorSubject<AppStateValue>(this.state)

	constructor() {
		this._machine.start()
		this._machine.onTransition((state) => {
			this._state$.next(state.value as AppStateMatches)
			this._contextMenu$.next(state.context.view.contextMenu)
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
		return this.snapshot.value as AppStateMatchesModel
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

	subscribeContextMenu() {
		return this._contextMenu$.asObservable()
	}

	matches(matches: AppStateMatches) {
		return this.snapshot.matches(matches)
	}
}