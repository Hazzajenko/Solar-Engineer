import { Injectable } from '@angular/core'
import { graphicsSettingsInterpreter, GraphicsSettingsStateValue } from './graphics-settings.interpreter'
import { GraphicsSettingsEvent } from './graphics-settings.event'
import { BehaviorSubject } from 'rxjs'

@Injectable({
	providedIn: 'root',
})
export class GraphicsSettingsMachineService {
	private _machine = graphicsSettingsInterpreter
	private _state$ = new BehaviorSubject<GraphicsSettingsStateValue>(this.state)

	constructor() {
		this._machine.onTransition((state) => {
			this._state$.next(state.value as GraphicsSettingsStateValue)
		})
	}

	get ctx() {
		return this._machine.getSnapshot().context
	}

	get state() {
		return this._machine.getSnapshot().value as GraphicsSettingsStateValue
	}

	subscribe() {
		return this._state$.asObservable()
	}

	sendEvent(event: GraphicsSettingsEvent) {
		return this._machine.send(event)
	}

	/*	sendEventNoPayload(event: GraphicsSettingsEvents) {
	 return this._machine.send({ type: event })
	 }*/
}
