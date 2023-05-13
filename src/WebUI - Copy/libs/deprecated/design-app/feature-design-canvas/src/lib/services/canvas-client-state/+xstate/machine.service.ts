import { canvasAppMachine } from './client.machine'
import { stateEventLoggerExcludePointerState } from './machine-service'
import { STATE_MACHINE, StateMachine } from './machine.types'
import { selectedStateMachine } from './selected-state.machine'
import { ContextMenuType } from './view'
import { XStateEvent } from './xstate-app-events.types'
import { AppStateMatches, AppStateMatchesModel } from './xstate-app.states'
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { interpret } from 'xstate'

@Injectable({
	providedIn: 'root',
})
export class MachineService {
	private _machine = interpret(
		canvasAppMachine.withConfig({
			actions: {
				SetMultipleSelectedEntities: (ctx, event) => {
					const ids = event.payload.ids
					this.sendStateEvent(STATE_MACHINE.SELECTED, {
						type: 'SetMultipleSelectedEntities',
						payload: { ids },
					})
					return
				},
			},
		}),
		{ devTools: true },
	).onTransition((state) => {
		stateEventLoggerExcludePointerState(state)
	})
	private _selectedMachine = interpret(selectedStateMachine, {
		devTools: true,
	})
	private _state$ = new BehaviorSubject<AppStateMatches>(this.appSnapshot.value as AppStateMatches)
	private _contextMenu$ = new BehaviorSubject<
		| {
				x: number
				y: number
				id: string
				type: ContextMenuType
		  }
		| undefined
	>(this.appSnapshot.context.view.contextMenu)

	// private _state$ = new BehaviorSubject<AppStateValue>(this.state)

	constructor() {
		this._machine.start()
		this._machine.onTransition((state) => {
			this._state$.next(state.value as AppStateMatches)
			this._contextMenu$.next(state.context.view.contextMenu)
			// this._state$.next(state.value as AppStateValue)
		})
		this._selectedMachine.start()
		this._selectedMachine.onTransition((state) => {
			console.log('state', state)
			// this._state$.next(state.value as AppStateValue)
		})
	}

	get appCtx() {
		return this._machine.getSnapshot().context
	}

	get selectedCtx() {
		return this._selectedMachine.getSnapshot().context
	}

	get allCtx() {
		return {
			appCtx: this.appCtx,
			selectedCtx: this.selectedCtx,
		}
	}

	get appSnapshot() {
		return this._machine.getSnapshot()
	}

	get selectedSnapshot() {
		return this._selectedMachine.getSnapshot()
	}

	get allSnapshots() {
		return {
			appSnapshot: this.appSnapshot,
			selectedSnapshot: this.selectedSnapshot,
		}
	}

	get state() {
		return this.appSnapshot.value as AppStateMatchesModel
	}

	sendEvent(event: XStateEvent) {
		const eventType = event.type
		if (eventType === 'SetMultipleSelectedEntities') {
			this._selectedMachine.send(event as any)
		}
		if (eventType.includes('Selected')) {
			this._selectedMachine.send(event as any)
		}
		if (event.type.includes('Selected')) {
			this._selectedMachine.send(event as any)
		}
		return this._machine.send(event)
	}

	sendStateEvent(machine: StateMachine, event: XStateEvent) {
		if (machine === STATE_MACHINE.SELECTED) {
			return this._selectedMachine.send(event as any)
		}
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
		return this.appSnapshot.matches(matches)
	}
}
