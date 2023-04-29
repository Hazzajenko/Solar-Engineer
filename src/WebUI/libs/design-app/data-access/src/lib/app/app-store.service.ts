import { selectedStateMachine } from '../selected'
import { ContextMenuType } from '../view'
import { appStateMachine } from './app-state.machine'
import { Injectable } from '@angular/core'
import {
	AppStateMatches,
	AppStateMatchesModel,
	STATE_MACHINE,
	stateEventLoggerExcludePointerState,
	StateMachine,
	XStateEvent,
} from '@design-app/feature-design-canvas'
import { BehaviorSubject } from 'rxjs'
import { interpret } from 'xstate'


@Injectable({
	providedIn: 'root',
})
export class AppStoreService {
	private _appMachine = interpret(appStateMachine, { devTools: true }).onTransition((state) => {
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
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  }
		| undefined
	>(this.appSnapshot.context.view.contextMenu)

	// private _state$ = new BehaviorSubject<AppStateValue>(this.state)

	constructor() {
		this._appMachine.start()
		this._appMachine.onTransition((state) => {
			this._state$.next(state.value as AppStateMatches)
			this._contextMenu$.next(state.context.view.contextMenu)
		})
		this._selectedMachine.start()
		this._selectedMachine.onTransition((state) => {
			console.log('state', state)
		})
	}

	get appCtx() {
		return this._appMachine.getSnapshot().context
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
		return this._appMachine.getSnapshot()
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
		return this._appMachine.send(event as any)
	}

	sendStateEvent(machine: StateMachine, event: XStateEvent) {
		if (machine === STATE_MACHINE.SELECTED) {
			return this._selectedMachine.send(event as any)
		}
		return this._appMachine.send(event as any)
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