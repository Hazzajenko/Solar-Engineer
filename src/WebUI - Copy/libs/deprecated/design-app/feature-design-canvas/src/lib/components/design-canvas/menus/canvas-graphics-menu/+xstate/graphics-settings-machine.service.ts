import { GraphicsSettingsEvent } from './graphics-settings.event'
import { graphicsSettingsInterpreter, GraphicsStateSnapshot } from './graphics-settings.interpreter'
import { GraphicsStateMatches, GraphicsStateValue } from './graphics-settings.states'
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
	providedIn: 'root',
})
export class GraphicsSettingsMachineService {
	private _machine = graphicsSettingsInterpreter
	private _state$ = new BehaviorSubject<GraphicsStateValue>(this.state)

	constructor() {
		this._machine.start()
		this._machine.onTransition((state) => {
			this._state$.next(state.value as GraphicsStateValue)
		})
	}

	get ctx() {
		return this._machine.getSnapshot().context
	}

	get state() {
		return this._machine.getSnapshot().value as GraphicsStateValue
	}

	get snapshot(): GraphicsStateSnapshot {
		return this._machine.getSnapshot()
	}

	subscribe() {
		return this._state$.asObservable()
	}

	sendEvent(event: GraphicsSettingsEvent) {
		return this._machine.send(event)
	}

	matches(matches: GraphicsStateMatches) {
		return this._machine.getSnapshot().matches(matches)
	}
}
